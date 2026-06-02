import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";

import prisma from "../../src/config/db.js";
import {
    api,
    bearer,
    integrationApp,
    resetDatabase,
    seedDepartment,
    seedInstructorProfile,
    seedStudentProfile,
    seedUser,
} from "../helpers/integration.js";

describe("users rbac api integration", () => {
    beforeAll(() => {
        integrationApp();
    });

    beforeEach(async () => {
        await resetDatabase();
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    it("rejects unauthenticated access to /users", async () => {
        const res = await api().get("/users");
        expect(res.status).toBe(401);
    });

    it("rejects non-admin access to /users", async () => {
        const dept = await seedDepartment();
        const student = await seedUser({
            email: "student.one-ug@aau.edu.et",
            name: "Student One",
            role: "STUDENT",
            isVerified: true,
        });
        await seedStudentProfile(student.id, dept.id);

        const res = await api().get("/users").set("Authorization", bearer(student.id, "STUDENT"));
        expect(res.status).toBe(403);
    });

    it("allows admin to list users", async () => {
        const dept = await seedDepartment();
        const admin = await seedUser({
            email: "admin@uni.test",
            name: "Admin User",
            role: "ADMIN",
            isVerified: true,
        });
        const instructor = await seedUser({
            email: "john.smith@aau.edu.et",
            name: "Instructor User",
            role: "INSTRUCTOR",
            isVerified: true,
        });
        await seedInstructorProfile(instructor.id, dept.id);

        const res = await api().get("/users").set("Authorization", bearer(admin.id, "ADMIN"));
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
    });

    it("allows admin to create instructor user", async () => {
        await seedDepartment();
        const admin = await seedUser({
            email: "admin2@uni.test",
            name: "Admin User 2",
            role: "ADMIN",
            isVerified: true,
        });

        const res = await api()
            .post("/users")
            .set("Authorization", bearer(admin.id, "ADMIN"))
            .send({
                email: "new.instructor@aau.edu.et",
                name: "New Instructor",
                role: "INSTRUCTOR",
            });

        expect(res.status).toBe(201);
        expect(res.body.user.email).toBe("new.instructor@aau.edu.et");
        expect(res.body.user.role).toBe("INSTRUCTOR");
        expect(typeof res.body.temporaryPassword).toBe("string");
    });

    it("rejects unauthenticated PUT /users/:id", async () => {
        const res = await api()
            .put("/users/00000000-0000-4000-8000-000000000099")
            .send({ email: "x@aau.edu.et", name: "X", role: "INSTRUCTOR" });
        expect(res.status).toBe(401);
    });

    it("rejects non-admin PUT /users/:id", async () => {
        const dept = await seedDepartment();
        const student = await seedUser({
            email: "student.put-ug@aau.edu.et",
            name: "Student Put",
            role: "STUDENT",
            isVerified: true,
        });
        await seedStudentProfile(student.id, dept.id);
        const instructor = await seedUser({
            email: "instructor.put@aau.edu.et",
            name: "Instructor Put",
            role: "INSTRUCTOR",
            isVerified: true,
        });
        await seedInstructorProfile(instructor.id, dept.id);

        const res = await api()
            .put(`/users/${instructor.id}`)
            .set("Authorization", bearer(student.id, "STUDENT"))
            .send({
                email: "instructor.put@aau.edu.et",
                name: "Updated Name",
                role: "INSTRUCTOR",
            });
        expect(res.status).toBe(403);
    });

    it("allows admin to update a user", async () => {
        const dept = await seedDepartment();
        const admin = await seedUser({
            email: "admin.put@uni.test",
            name: "Admin Put",
            role: "ADMIN",
            isVerified: true,
        });
        const instructor = await seedUser({
            email: "target.instructor@aau.edu.et",
            name: "Target Instructor",
            role: "INSTRUCTOR",
            isVerified: true,
        });
        await seedInstructorProfile(instructor.id, dept.id);

        const res = await api()
            .put(`/users/${instructor.id}`)
            .set("Authorization", bearer(admin.id, "ADMIN"))
            .send({
                email: "target.instructor@aau.edu.et",
                name: "Renamed Instructor",
                role: "INSTRUCTOR",
            });

        expect(res.status).toBe(200);
        expect(res.body.user.name).toBe("Renamed Instructor");
    });

    it("returns 404 when admin updates unknown user id", async () => {
        const admin = await seedUser({
            email: "admin.put404@uni.test",
            name: "Admin 404",
            role: "ADMIN",
            isVerified: true,
        });

        const res = await api()
            .put("/users/00000000-0000-4000-8000-000000000099")
            .set("Authorization", bearer(admin.id, "ADMIN"))
            .send({
                email: "ghost@aau.edu.et",
                name: "Ghost",
                role: "STUDENT",
            });

        expect(res.status).toBe(404);
    });

    it("rejects unauthenticated DELETE /users/:id", async () => {
        const res = await api().delete("/users/00000000-0000-4000-8000-000000000099");
        expect(res.status).toBe(401);
    });

    it("rejects non-admin DELETE /users/:id", async () => {
        const dept = await seedDepartment();
        const student = await seedUser({
            email: "student.del-ug@aau.edu.et",
            name: "Student Del",
            role: "STUDENT",
            isVerified: true,
        });
        await seedStudentProfile(student.id, dept.id);
        const instructor = await seedUser({
            email: "instructor.del@aau.edu.et",
            name: "Instructor Del",
            role: "INSTRUCTOR",
            isVerified: true,
        });
        await seedInstructorProfile(instructor.id, dept.id);

        const res = await api()
            .delete(`/users/${instructor.id}`)
            .set("Authorization", bearer(student.id, "STUDENT"));
        expect(res.status).toBe(403);
    });

    it("allows admin to delete instructor and blocks admin deletion", async () => {
        const dept = await seedDepartment();
        const admin = await seedUser({
            email: "admin.del@uni.test",
            name: "Admin Del",
            role: "ADMIN",
            isVerified: true,
        });
        const otherAdmin = await seedUser({
            email: "other.admin@uni.test",
            name: "Other Admin",
            role: "ADMIN",
            isVerified: true,
        });
        const instructor = await seedUser({
            email: "delete.me@aau.edu.et",
            name: "Delete Me",
            role: "INSTRUCTOR",
            isVerified: true,
        });
        await seedInstructorProfile(instructor.id, dept.id);

        const deleteInstructorRes = await api()
            .delete(`/users/${instructor.id}`)
            .set("Authorization", bearer(admin.id, "ADMIN"));
        expect(deleteInstructorRes.status).toBe(204);

        const deleteAdminRes = await api()
            .delete(`/users/${otherAdmin.id}`)
            .set("Authorization", bearer(admin.id, "ADMIN"));
        expect(deleteAdminRes.status).toBe(400);
        expect(deleteAdminRes.body.error).toBe("Cannot delete an admin user");
    });
});
