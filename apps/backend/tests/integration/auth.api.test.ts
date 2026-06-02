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

    it("returns 400 for invalid verification token", async () => {
        const res = await api().get("/auth/verify-email").query({ token: "missing-token" });
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Invalid or expired verification link");
    });

    it("blocks login for unverified student", async () => {
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

        expect(res.status).toBe(403);
        expect(res.body.message).toBe("Please verify your email before logging in.");
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

    it("returns 503 on register when Brevo is not configured", async () => {
        const previous = {
            BREVO_EMAIL: process.env.BREVO_EMAIL,
            BREVO_SMTP_KEY: process.env.BREVO_SMTP_KEY,
            FROM_EMAIL: process.env.FROM_EMAIL,
        };
        delete process.env.BREVO_EMAIL;
        delete process.env.BREVO_SMTP_KEY;
        delete process.env.FROM_EMAIL;

        const dept = await seedDepartment();
        const existing = await seedUser({
            email: "existing.student-ug@aau.edu.et",
            name: "Existing Student",
            role: "STUDENT",
            isVerified: true,
        });
        await seedStudentProfile(existing.id, dept.id);

        try {
            const res = await api().post("/auth/register").send({
                email: "new.student-ug@aau.edu.et",
                firstName: "New",
                lastName: "Student",
                password: "password123",
                role: "STUDENT",
            });
            expect(res.status).toBe(503);
            expect(res.body.message).toContain("Email service is not configured");
        } finally {
            if (previous.BREVO_EMAIL !== undefined) process.env.BREVO_EMAIL = previous.BREVO_EMAIL;
            if (previous.BREVO_SMTP_KEY !== undefined) process.env.BREVO_SMTP_KEY = previous.BREVO_SMTP_KEY;
            if (previous.FROM_EMAIL !== undefined) process.env.FROM_EMAIL = previous.FROM_EMAIL;
        }
    });

    it("verifies email with a valid token and clears verification state", async () => {
        const token = "valid-verification-token-abc123";
        const { user } = await seedUnverifiedStudent({
            email: "verify.me-ug@aau.edu.et",
            verificationToken: token,
        });

        const res = await api().get("/auth/verify-email").query({ token });

        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Email verified successfully. You can now sign in.");

        const updated = await prisma.user.findUnique({ where: { id: user.id } });
        expect(updated?.isVerified).toBe(true);
        expect(updated?.verificationToken).toBeNull();
    });

    it("allows login after email verification", async () => {
        const token = "verify-then-login-token";
        await seedUnverifiedStudent({
            email: "login.after.verify-ug@aau.edu.et",
            verificationToken: token,
        });

        await api().get("/auth/verify-email").query({ token });

        const loginRes = await api().post("/auth/login").send({
            email: "login.after.verify-ug@aau.edu.et",
            password: "password123",
        });

        expect(loginRes.status).toBe(200);
        expect(loginRes.body.accessToken).toBeTypeOf("string");
    });

    it("returns already-verified message when token belongs to verified user", async () => {
        const token = "stale-token-for-verified-user";
        const dept = await seedDepartment();
        const student = await seedUser({
            email: "already.verified-ug@aau.edu.et",
            name: "Already Verified",
            role: "STUDENT",
            isVerified: true,
            verificationToken: token,
        });
        await seedStudentProfile(student.id, dept.id);

        const res = await api().get("/auth/verify-email").query({ token });

        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Your account is already verified. You can now sign in.");
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
