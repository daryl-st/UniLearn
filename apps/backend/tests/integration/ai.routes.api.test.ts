import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";

import prisma from "../../src/config/db.js";
import {
    api,
    assignInstructor,
    bearer,
    integrationApp,
    resetDatabase,
    seedCloudinaryResource,
    seedCourse,
    seedDepartment,
    seedInstructorProfile,
    seedStudentProfile,
    seedUser,
} from "../helpers/integration.js";

/**
 * When P0 locks /ai/extract/* and /ai/ingest/resource, flip open-route tests to expect 401/403.
 */
describe("ai routes api integration", () => {
    beforeAll(() => {
        integrationApp();
    });

    beforeEach(async () => {
        await resetDatabase();
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    async function seedStudentWithResource() {
        const dept = await seedDepartment();
        const instructor = await seedUser({
            email: "ai.instructor@aau.edu.et",
            name: "AI Instructor",
            role: "INSTRUCTOR",
            isVerified: true,
        });
        await seedInstructorProfile(instructor.id, dept.id);
        const student = await seedUser({
            email: "ai.student-ug@aau.edu.et",
            name: "AI Student",
            role: "STUDENT",
            isVerified: true,
        });
        await seedStudentProfile(student.id, dept.id);
        const course = await seedCourse({
            departmentId: dept.id,
            instructorProfileId: instructor.id,
            code: "COSC-AI",
        });
        await assignInstructor(course.id, instructor.id);
        const resource = await seedCloudinaryResource({
            courseId: course.id,
            instructorUserId: instructor.id,
        });
        return { student, instructor, resource };
    }

    describe("student-only routes", () => {
        it("returns 401 for GET /ai/summaries without token", async () => {
            const res = await api()
                .get("/ai/summaries")
                .query({ resourceId: "00000000-0000-4000-8000-000000000001" });
            expect(res.status).toBe(401);
        });

        it("returns 403 for GET /ai/summaries as instructor or admin", async () => {
            const { instructor, resource } = await seedStudentWithResource();
            const admin = await seedUser({
                email: "ai.admin@uni.test",
                name: "AI Admin",
                role: "ADMIN",
                isVerified: true,
            });

            const instructorRes = await api()
                .get("/ai/summaries")
                .query({ resourceId: resource.id })
                .set("Authorization", bearer(instructor.id, "INSTRUCTOR"));
            expect(instructorRes.status).toBe(403);

            const adminRes = await api()
                .get("/ai/summaries")
                .query({ resourceId: resource.id })
                .set("Authorization", bearer(admin.id, "ADMIN"));
            expect(adminRes.status).toBe(403);
        });

        it("returns 200 with empty summaries for student with valid resourceId", async () => {
            const { student, resource } = await seedStudentWithResource();

            const res = await api()
                .get("/ai/summaries")
                .query({ resourceId: resource.id })
                .set("Authorization", bearer(student.id, "STUDENT"));

            expect(res.status).toBe(200);
            expect(res.body.summaries).toEqual([]);
        });

        it("returns 401 for POST /ai/summarize without token", async () => {
            const res = await api().post("/ai/summarize").send({});
            expect(res.status).toBe(401);
        });

        it("returns 403 for POST /ai/summarize as instructor", async () => {
            const { instructor } = await seedStudentWithResource();

            const res = await api()
                .post("/ai/summarize")
                .set("Authorization", bearer(instructor.id, "INSTRUCTOR"))
                .send({ resourceId: "00000000-0000-4000-8000-000000000001" });
            expect(res.status).toBe(403);
        });

        it("returns 400 for POST /ai/summarize as student with invalid body", async () => {
            const { student } = await seedStudentWithResource();

            const res = await api()
                .post("/ai/summarize")
                .set("Authorization", bearer(student.id, "STUDENT"))
                .send({});
            expect(res.status).toBe(400);
            expect(res.body.error).toBe("Validation Failed!");
        });
    });

    describe("open-route security regression", () => {
        it("allows POST /ai/extract/file without auth but returns 400 when file missing", async () => {
            const res = await api().post("/ai/extract/file");
            expect(res.status).not.toBe(401);
            expect(res.status).toBe(400);
            expect(res.body.error).toContain("Missing PDF file");
        });

        it("allows POST /ai/extract/url without auth but returns 400 for invalid body", async () => {
            const res = await api().post("/ai/extract/url").send({});
            expect(res.status).not.toBe(401);
            expect(res.status).toBe(400);
            expect(res.body.error).toBe("Invalid body");
        });

        it("allows POST /ai/ingest/resource without auth but returns 400 for invalid body", async () => {
            const res = await api().post("/ai/ingest/resource").send({});
            expect(res.status).not.toBe(401);
            expect(res.status).toBe(400);
            expect(res.body.error).toBe("Validation Failed!");
        });
    });
});
