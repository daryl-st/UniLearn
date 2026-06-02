import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";

import prisma from "../../src/config/db.js";
import {
    api,
    assignInstructor,
    bearer,
    integrationApp,
    resetDatabase,
    seedCourse,
    seedDepartment,
    seedInstructorProfile,
    seedProgress,
    seedStudentProfile,
    seedUser,
} from "../helpers/integration.js";

describe("dashboard api integration", () => {
    beforeAll(() => {
        integrationApp();
    });

    beforeEach(async () => {
        await resetDatabase();
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    async function seedRolesFixture() {
        const dept = await seedDepartment();
        const admin = await seedUser({
            email: "dash.admin@uni.test",
            name: "Dash Admin",
            role: "ADMIN",
            isVerified: true,
        });
        const instructor = await seedUser({
            email: "dash.instructor@aau.edu.et",
            name: "Dash Instructor",
            role: "INSTRUCTOR",
            isVerified: true,
        });
        await seedInstructorProfile(instructor.id, dept.id);
        const student = await seedUser({
            email: "dash.student-ug@aau.edu.et",
            name: "Dash Student",
            role: "STUDENT",
            isVerified: true,
        });
        await seedStudentProfile(student.id, dept.id);
        const course = await seedCourse({
            departmentId: dept.id,
            instructorProfileId: instructor.id,
            code: "COSC-DASH",
        });
        await assignInstructor(course.id, instructor.id);
        await seedProgress(student.id, course.id);
        return { admin, instructor, student };
    }

    describe("GET /dashboard/admin", () => {
        it("returns 401 when unauthenticated", async () => {
            const res = await api().get("/dashboard/admin");
            expect(res.status).toBe(401);
        });

        it("returns 403 for non-admin roles", async () => {
            const { student } = await seedRolesFixture();
            const res = await api()
                .get("/dashboard/admin")
                .set("Authorization", bearer(student.id, "STUDENT"));
            expect(res.status).toBe(403);
        });

        it("returns admin stats contract for admin", async () => {
            const { admin } = await seedRolesFixture();
            const res = await api()
                .get("/dashboard/admin")
                .set("Authorization", bearer(admin.id, "ADMIN"));

            expect(res.status).toBe(200);
            expect(res.body).toMatchObject({
                totalUsers: expect.any(Number),
                totalStudents: expect.any(Number),
                totalCourses: expect.any(Number),
            });
            expect(res.body.weeklyUserGrowth).toBeInstanceOf(Array);
            expect(res.body.recentCourses).toBeInstanceOf(Array);
        });
    });

    describe("GET /dashboard/instructor", () => {
        it("returns 401 when unauthenticated", async () => {
            const res = await api().get("/dashboard/instructor");
            expect(res.status).toBe(401);
        });

        it("returns 403 for student role", async () => {
            const { student } = await seedRolesFixture();
            const res = await api()
                .get("/dashboard/instructor")
                .set("Authorization", bearer(student.id, "STUDENT"));
            expect(res.status).toBe(403);
        });

        it("returns instructor stats contract for instructor", async () => {
            const { instructor } = await seedRolesFixture();
            const res = await api()
                .get("/dashboard/instructor")
                .set("Authorization", bearer(instructor.id, "INSTRUCTOR"));

            expect(res.status).toBe(200);
            expect(res.body).toMatchObject({
                assignedCoursesCount: expect.any(Number),
            });
            expect(res.body.courses).toBeInstanceOf(Array);
            expect(res.body.dropoffData).toBeInstanceOf(Array);
            expect(res.body.atRiskCohort).toBeInstanceOf(Array);
        });
    });

    describe("GET /dashboard/student", () => {
        it("returns 401 when unauthenticated", async () => {
            const res = await api().get("/dashboard/student");
            expect(res.status).toBe(401);
        });

        it("returns 403 for instructor role", async () => {
            const { instructor } = await seedRolesFixture();
            const res = await api()
                .get("/dashboard/student")
                .set("Authorization", bearer(instructor.id, "INSTRUCTOR"));
            expect(res.status).toBe(403);
        });

        it("returns student stats contract for student", async () => {
            const { student } = await seedRolesFixture();
            const res = await api()
                .get("/dashboard/student")
                .set("Authorization", bearer(student.id, "STUDENT"));

            expect(res.status).toBe(200);
            expect(res.body).toMatchObject({
                enrolledCoursesCount: expect.any(Number),
                overallProgress: expect.any(Number),
            });
            expect(res.body.coursesProgressDetails).toBeInstanceOf(Array);
            expect(res.body.activityPulse).toBeInstanceOf(Array);
            expect(res.body.monthlyPerformance).toBeInstanceOf(Array);
        });
    });
});
