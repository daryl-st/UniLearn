import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import bcrypt from "bcrypt";

import prisma from "../../src/config/db.js";
import {
    api,
    extractRefreshCookie,
    loginWithCookies,
    resetDatabase,
    seedDepartment,
    seedStudentProfile,
    seedUnverifiedStudent,
    seedUser,
    integrationApp,
} from "../helpers/integration.js";

describe("auth api integration", () => {
    beforeAll(() => {
        integrationApp();
    });

    beforeEach(async () => {
        await resetDatabase();
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    it("returns 401 for /auth/me without token", async () => {
        const res = await api().get("/auth/me");
        expect(res.status).toBe(401);
    });

    it("allows student login even when isVerified is false in DB (legacy rows)", async () => {
        const dept = await seedDepartment();
        const student = await seedUser({
            email: "john.smith-ug@aau.edu.et",
            name: "John Smith",
            role: "STUDENT",
            password: "password123",
            isVerified: false,
        });
        await seedStudentProfile(student.id, dept.id);

        const res = await api().post("/auth/login").send({
            email: "john.smith-ug@aau.edu.et",
            password: "password123",
        });

        expect(res.status).toBe(200);
        expect(res.body.accessToken).toBeTypeOf("string");
    });

    it("allows verified student login and authenticated /auth/me", async () => {
        const dept = await seedDepartment();
        const student = await seedUser({
            email: "jane.doe-ug@aau.edu.et",
            name: "Jane Doe",
            role: "STUDENT",
            password: "password123",
            isVerified: true,
        });
        await seedStudentProfile(student.id, dept.id);

        const loginRes = await api().post("/auth/login").send({
            email: "jane.doe-ug@aau.edu.et",
            password: "password123",
        });

        expect(loginRes.status).toBe(200);
        expect(loginRes.body.accessToken).toBeTypeOf("string");

        const meRes = await api()
            .get("/auth/me")
            .set("Authorization", `Bearer ${loginRes.body.accessToken}`);

        expect(meRes.status).toBe(200);
        expect(meRes.body.user.email).toBe("jane.doe-ug@aau.edu.et");
    });

    it("registers a new student and returns access token without email", async () => {
        const res = await api().post("/auth/register").send({
            email: "new.student-ug@aau.edu.et",
            firstName: "New",
            lastName: "Student",
            password: "password123",
            role: "STUDENT",
        });

        expect(res.status).toBe(201);
        expect(res.body.accessToken).toBeTypeOf("string");
        expect(res.body.user.email).toBe("new.student-ug@aau.edu.et");

        const created = await prisma.user.findUnique({
            where: { email: "new.student-ug@aau.edu.et" },
        });
        expect(created?.isVerified).toBe(true);
    });

    it("re-registers an unverified legacy student and allows sign-in", async () => {
        await seedUnverifiedStudent({
            email: "legacy.unverified-ug@aau.edu.et",
            verificationToken: "old-token",
        });

        const registerRes = await api().post("/auth/register").send({
            email: "legacy.unverified-ug@aau.edu.et",
            firstName: "Legacy",
            lastName: "Student",
            password: "newpassword123",
            role: "STUDENT",
        });
        expect(registerRes.status).toBe(201);

        const loginRes = await api().post("/auth/login").send({
            email: "legacy.unverified-ug@aau.edu.et",
            password: "newpassword123",
        });
        expect(loginRes.status).toBe(200);
    });

    it("rotates refresh token, revokes the prior session in DB, and allows refresh with the new cookie", async () => {
        const dept = await seedDepartment();
        const student = await seedUser({
            email: "refresh.test-ug@aau.edu.et",
            name: "Refresh Test",
            role: "STUDENT",
            isVerified: true,
        });
        await seedStudentProfile(student.id, dept.id);

        const { agent, res: loginRes } = await loginWithCookies(
            "refresh.test-ug@aau.edu.et",
            "password123",
        );
        const oldRefresh = extractRefreshCookie(loginRes.headers["set-cookie"]);
        expect(oldRefresh).toBeTypeOf("string");

        // JWT iat is second-granular; ensure rotation produces a distinct token.
        await new Promise((resolve) => setTimeout(resolve, 1100));

        const refreshRes = await agent.post("/auth/refresh");
        expect(refreshRes.status).toBe(200);
        expect(refreshRes.body.accessToken).toBeTypeOf("string");

        const newRefresh = extractRefreshCookie(refreshRes.headers["set-cookie"]);
        expect(newRefresh).toBeDefined();
        expect(newRefresh).not.toBe(oldRefresh);

        const revoked = await prisma.refreshToken.findMany({
            where: { userId: student.id, revoked: true },
        });
        expect(revoked.length).toBeGreaterThan(0);
        const oldWasRevoked = await Promise.all(
            revoked.map((row) => bcrypt.compare(oldRefresh!, row.tokenHash)),
        );
        expect(oldWasRevoked.some(Boolean)).toBe(true);

        const secondRefresh = await agent.post("/auth/refresh");
        expect(secondRefresh.status).toBe(200);
        expect(secondRefresh.body.accessToken).toBeTypeOf("string");
    });

    it("logs out and invalidates refresh token", async () => {
        const dept = await seedDepartment();
        const student = await seedUser({
            email: "logout.test-ug@aau.edu.et",
            name: "Logout Test",
            role: "STUDENT",
            isVerified: true,
        });
        await seedStudentProfile(student.id, dept.id);

        const { agent, res: loginRes } = await loginWithCookies(
            "logout.test-ug@aau.edu.et",
            "password123",
        );
        const refreshCookie = extractRefreshCookie(loginRes.headers["set-cookie"]);

        const logoutRes = await agent.post("/auth/logout");
        expect(logoutRes.status).toBe(204);

        const refreshAfterLogout = await api()
            .post("/auth/refresh")
            .set("Cookie", `refreshToken=${refreshCookie}`);
        expect(refreshAfterLogout.status).toBe(403);
    });

    it("returns 401 on refresh without cookie", async () => {
        const res = await api().post("/auth/refresh");
        expect(res.status).toBe(401);
        expect(res.body.message).toBe("No refresh token!");
    });
});
