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
    seedUser,
} from "../helpers/integration.js";

describe("resource permissions api integration", () => {
    beforeAll(() => {
        integrationApp();
    });

    beforeEach(async () => {
        await resetDatabase();
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    it("requires auth for GET /course/resource", async () => {
        const res = await api().get("/course/resource").query({ courseId: "00000000-0000-4000-8000-000000000001" });
        expect(res.status).toBe(401);
    });

    it("forbids instructor not assigned to the course", async () => {
        const dept = await seedDepartment();
        const ownerInstructor = await seedUser({
            email: "owner.instructor@aau.edu.et",
            name: "Owner Instructor",
            role: "INSTRUCTOR",
            isVerified: true,
        });
        await seedInstructorProfile(ownerInstructor.id, dept.id);

        const otherInstructor = await seedUser({
            email: "other.instructor@aau.edu.et",
            name: "Other Instructor",
            role: "INSTRUCTOR",
            isVerified: true,
        });
        await seedInstructorProfile(otherInstructor.id, dept.id);

        const course = await seedCourse({
            departmentId: dept.id,
            instructorProfileId: ownerInstructor.id,
            code: "COSC9901",
            name: "Integration Course",
        });
        await assignInstructor(course.id, ownerInstructor.id);

        const res = await api()
            .get("/course/resource")
            .query({ courseId: course.id })
            .set("Authorization", bearer(otherInstructor.id, "INSTRUCTOR"));

        expect(res.status).toBe(403);
        expect(res.body.error).toContain("Instructor not assigned");
    });

    it("denies delete when instructorId body does not match resource owner", async () => {
        const dept = await seedDepartment();
        const owner = await seedUser({
            email: "owner.delete@aau.edu.et",
            name: "Owner Delete",
            role: "INSTRUCTOR",
            isVerified: true,
        });
        await seedInstructorProfile(owner.id, dept.id);

        const attacker = await seedUser({
            email: "attacker.delete@aau.edu.et",
            name: "Attacker Delete",
            role: "INSTRUCTOR",
            isVerified: true,
        });
        await seedInstructorProfile(attacker.id, dept.id);

        const course = await seedCourse({
            departmentId: dept.id,
            instructorProfileId: owner.id,
            code: "COSC9902",
            name: "Delete Permission Course",
        });
        await assignInstructor(course.id, owner.id);

        const resource = await seedCloudinaryResource({
            courseId: course.id,
            instructorUserId: owner.id,
            title: "Delete Target",
        });

        const res = await api()
            .delete(`/course/resource/${resource.id}`)
            .set("Authorization", bearer(attacker.id, "INSTRUCTOR"))
            .send({ instructorId: attacker.id });

        expect(res.status).toBe(403);
        expect(res.body.error).toBe("Permission Denied!");
    });
});
