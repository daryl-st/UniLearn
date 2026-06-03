import { describe, expect, it } from "vitest";
import bcrypt from "bcrypt";

import { AuthService } from "../src/modules/Auth/auth.service.js";
import { AAU_STUDENT_EMAIL_ERROR } from "../src/modules/Auth/aauEmail.js";

function createAuthService(overrides: Record<string, unknown> = {}) {
    const repo = {
        findUserByEmail: async () => null,
        findUserByVerificationToken: async () => null,
        create: async () => ({
            id: "new-student-id",
            email: "john.smith-ug@aau.edu.et",
            name: "John Smith",
            password: "hashed",
            role: "STUDENT",
            isVerified: true,
        }),
        createRefreshToken: async () => null,
        findUserById: async () => null,
        ...overrides,
    };
    return new AuthService(repo as never);
}

describe("auth registration and login", () => {
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

    it("allows login for students without checking isVerified", async () => {
        const hashed = await bcrypt.hash("password123", 10);
        const service = createAuthService({
            findUserByEmail: async () => ({
                id: "student-id",
                role: "STUDENT",
                isVerified: false,
                password: hashed,
                email: "john.smith-ug@aau.edu.et",
                name: "John",
            }),
            createRefreshToken: async () => null,
        });

        const result = await service.loginUser({
            email: "john.smith-ug@aau.edu.et",
            password: "password123",
        });

        expect(result.accessToken).toBeTypeOf("string");
    });
});
