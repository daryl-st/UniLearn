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
    seedStudentProfile,
    seedUser,
} from "../helpers/integration.js";

describe("course rbac api integration", () => {
    beforeAll(() => {
        integrationApp();
    });

    beforeEach(async () => {
        await resetDatabase();
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    async function seedAdminInstructorStudent() {
        const dept = await seedDepartment();
        const admin = await seedUser({
            email: "course.admin@uni.test",
            name: "Course Admin",
            role: "ADMIN",
            isVerified: true,
        });
        const instructor = await seedUser({
            email: "course.instructor@aau.edu.et",
            name: "Course Instructor",
            role: "INSTRUCTOR",
            isVerified: true,
        });
        await seedInstructorProfile(instructor.id, dept.id);
        const student = await seedUser({
            email: "course.student-ug@aau.edu.et",
            name: "Course Student",
            role: "STUDENT",
            isVerified: true,
        });
        await seedStudentProfile(student.id, dept.id);
        return { dept, admin, instructor, student };
    }

    it("rejects unauthenticated POST /course", async () => {
        const res = await api().post("/course").send({
            name: "New Course",
            code: "COSC-101",
            acadamicYear: 2,
            instructorId: "00000000-0000-4000-8000-000000000001",
        });
        expect(res.status).toBe(401);
    });

    it("rejects non-admin POST /course", async () => {
        const { dept, instructor, student } = await seedAdminInstructorStudent();

        const studentRes = await api()
            .post("/course")
            .set("Authorization", bearer(student.id, "STUDENT"))
            .send({
                name: "Student Course",
                code: "COSC-STU",
                acadamicYear: 2,
                instructorId: instructor.id,
                departmentId: dept.id,
            });
        expect(studentRes.status).toBe(403);

        const instructorRes = await api()
            .post("/course")
            .set("Authorization", bearer(instructor.id, "INSTRUCTOR"))
            .send({
                name: "Instructor Course",
                code: "COSC-INS",
                acadamicYear: 2,
                instructorId: instructor.id,
                departmentId: dept.id,
            });
        expect(instructorRes.status).toBe(403);
    });

    it("allows admin to create a course", async () => {
        const { dept, admin, instructor } = await seedAdminInstructorStudent();

        const res = await api()
            .post("/course")
            .set("Authorization", bearer(admin.id, "ADMIN"))
            .send({
                name: "Data Structures",
                code: "COSC-201",
                acadamicYear: 2,
                instructorId: instructor.id,
                departmentId: dept.id,
            });

        expect(res.status).toBe(201);
        expect(res.body.code).toBe("COSC-201");
    });

    it("rejects non-admin PUT /course/:id", async () => {
        const { dept, instructor, student } = await seedAdminInstructorStudent();
        const course = await seedCourse({
            departmentId: dept.id,
            instructorProfileId: instructor.id,
            code: "COSC-PUT",
        });

        const res = await api()
            .put(`/course/${course.id}`)
            .set("Authorization", bearer(student.id, "STUDENT"))
            .send({ name: "Hacked Name" });
        expect(res.status).toBe(403);
    });

    it("allows admin to update a course", async () => {
        const { dept, admin, instructor } = await seedAdminInstructorStudent();
        const course = await seedCourse({
            departmentId: dept.id,
            instructorProfileId: instructor.id,
            code: "COSC-UPD",
        });

        const res = await api()
            .put(`/course/${course.id}`)
            .set("Authorization", bearer(admin.id, "ADMIN"))
            .send({ name: "Updated Course Name" });

        expect(res.status).toBe(200);
        expect(res.body.name).toBe("Updated Course Name");
    });

    it("rejects non-admin POST /course/:id/instructors", async () => {
        const { dept, instructor, student } = await seedAdminInstructorStudent();
        const course = await seedCourse({
            departmentId: dept.id,
            instructorProfileId: instructor.id,
            code: "COSC-ASN",
        });
        const otherInstructor = await seedUser({
            email: "other.assign@aau.edu.et",
            name: "Other Instructor",
            role: "INSTRUCTOR",
            isVerified: true,
        });
        await seedInstructorProfile(otherInstructor.id, dept.id);

        const res = await api()
            .post(`/course/${course.id}/instructors`)
            .set("Authorization", bearer(student.id, "STUDENT"))
            .send({ instructorId: otherInstructor.id });
        expect(res.status).toBe(403);
    });

    it("allows admin to assign an instructor to a course", async () => {
        const { dept, admin, instructor } = await seedAdminInstructorStudent();
        const course = await seedCourse({
            departmentId: dept.id,
            instructorProfileId: instructor.id,
            code: "COSC-ASSIGN",
        });

        const secondInstructor = await seedUser({
            email: "second.instructor@aau.edu.et",
            name: "Second Instructor",
            role: "INSTRUCTOR",
            isVerified: true,
        });
        await seedInstructorProfile(secondInstructor.id, dept.id);

        const res = await api()
            .post(`/course/${course.id}/instructors`)
            .set("Authorization", bearer(admin.id, "ADMIN"))
            .send({ instructorId: secondInstructor.id });

        expect(res.status).toBe(200);
    });

    it("rejects non-admin DELETE /course/:id", async () => {
        const { dept, instructor, student } = await seedAdminInstructorStudent();
        const course = await seedCourse({
            departmentId: dept.id,
            instructorProfileId: instructor.id,
            code: "COSC-DEL",
        });

        const res = await api()
            .delete(`/course/${course.id}`)
            .set("Authorization", bearer(student.id, "STUDENT"));
        expect(res.status).toBe(403);
    });

    it("allows admin to delete a course", async () => {
        const { dept, admin, instructor } = await seedAdminInstructorStudent();
        const course = await seedCourse({
            departmentId: dept.id,
            instructorProfileId: instructor.id,
            code: "COSC-RM",
        });

        const res = await api()
            .delete(`/course/${course.id}`)
            .set("Authorization", bearer(admin.id, "ADMIN"));
        expect(res.status).toBe(200);
        expect(res.body.code).toBe("COSC-RM");
    });
});
