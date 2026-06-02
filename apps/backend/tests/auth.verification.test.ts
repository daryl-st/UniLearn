import { describe, expect, it } from "vitest";
import bcrypt from "bcrypt";

import { AuthService } from "../src/modules/Auth/auth.service.js";
import { AAU_STUDENT_EMAIL_ERROR } from "../src/modules/Auth/aauEmail.js";
import { EmailServiceNotConfiguredError, sendVerificationEmail } from "../src/services/email.service.js";

function createAuthService(overrides: Record<string, unknown> = {}) {
    const repo = {
        findUserByEmail: async () => null,
        findUserByVerificationToken: async () => null,
        create: async () => null,
        createRefreshToken: async () => null,
        ...overrides,
    };
    return new AuthService(repo as never);
}

describe("auth verification flow", () => {
    it("rejects invalid student registration email format", async () => {
        const service = createAuthService();

        await expect(
            service.registerUser({
                email: "student@gmail.com",
                firstName: "John",
                lastName: "Doe",
                password: "secret123",
            }),
        ).rejects.toThrow(AAU_STUDENT_EMAIL_ERROR);
    });

    it("rejects empty verification token", async () => {
        const service = createAuthService();

        await expect(service.verifyEmail("")).rejects.toThrow("Invalid verification token");
    });

    it("rejects unknown verification token", async () => {
        const service = createAuthService({
            findUserByVerificationToken: async () => null,
        });

        await expect(service.verifyEmail("missing-token")).rejects.toThrow("Invalid or expired verification link");
    });

    it("blocks unverified students from login", async () => {
        const hashed = await bcrypt.hash("password123", 10);
        const service = createAuthService({
            findUserByEmail: async () => ({
                id: "student-id",
                role: "STUDENT",
                isVerified: false,
                password: hashed,
            }),
        });

        await expect(
            service.loginUser({
                email: "john.smith-ug@aau.edu.et",
                password: "password123",
            }),
        ).rejects.toThrow("Please verify your email before logging in.");
    });

    it("throws configuration error when Brevo env vars are missing", async () => {
        const previous = {
            BREVO_EMAIL: process.env.BREVO_EMAIL,
            BREVO_SMTP_KEY: process.env.BREVO_SMTP_KEY,
            FROM_EMAIL: process.env.FROM_EMAIL,
        };

        delete process.env.BREVO_EMAIL;
        delete process.env.BREVO_SMTP_KEY;
        delete process.env.FROM_EMAIL;

        try {
            await expect(
                sendVerificationEmail("student@aau.edu.et", "http://localhost:5173/verify-email?token=abc"),
            ).rejects.toBeInstanceOf(EmailServiceNotConfiguredError);
        } finally {
            if (previous.BREVO_EMAIL !== undefined) process.env.BREVO_EMAIL = previous.BREVO_EMAIL;
            if (previous.BREVO_SMTP_KEY !== undefined) process.env.BREVO_SMTP_KEY = previous.BREVO_SMTP_KEY;
            if (previous.FROM_EMAIL !== undefined) process.env.FROM_EMAIL = previous.FROM_EMAIL;
        }
    });
});
