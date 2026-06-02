import { describe, expect, it } from "vitest";
import {
    AAU_INSTRUCTOR_EMAIL_REGEX,
    AAU_STUDENT_EMAIL_REGEX,
    isAauInstructorEmail,
    isAauStudentEmail,
    normalizeInstructorEmail,
    normalizeLoginEmail,
    normalizeStudentEmail,
} from "../src/modules/Auth/aauEmail.js";

describe("aauEmail", () => {
    it("accepts valid AAU undergraduate emails", () => {
        expect(isAauStudentEmail("john.smith-ug@aau.edu.et")).toBe(true);
        expect(isAauStudentEmail("sara.bekele-ug@aau.edu.et")).toBe(true);
        expect(AAU_STUDENT_EMAIL_REGEX.test("John.Smith-ug@aau.edu.et")).toBe(true);
    });

    it("rejects invalid student emails", () => {
        expect(isAauStudentEmail("john@gmail.com")).toBe(false);
        expect(isAauStudentEmail("johnsmith-ug@aau.edu")).toBe(false);
        expect(isAauStudentEmail("john.smith@aau.edu.et")).toBe(false);
        expect(isAauStudentEmail("john@outlook.com")).toBe(false);
    });

    it("normalizes student email to lowercase", () => {
        expect(normalizeStudentEmail(" John.Smith-UG@aau.edu.et ")).toBe("john.smith-ug@aau.edu.et");
    });

    it("accepts valid AAU instructor emails", () => {
        expect(isAauInstructorEmail("john.smith@aau.edu.et")).toBe(true);
        expect(isAauInstructorEmail("sara.bekele@aau.edu.et")).toBe(true);
        expect(AAU_INSTRUCTOR_EMAIL_REGEX.test("Daniel.Kebede@aau.edu.et")).toBe(true);
    });

    it("rejects invalid instructor emails", () => {
        expect(isAauInstructorEmail("john@gmail.com")).toBe(false);
        expect(isAauInstructorEmail("john.smith-ug@aau.edu.et")).toBe(false);
        expect(isAauInstructorEmail("smith@aau.edu")).toBe(false);
        expect(isAauInstructorEmail("john@outlook.com")).toBe(false);
        expect(isAauInstructorEmail("johnsmith@aau.edu.et")).toBe(false);
    });

    it("normalizes instructor email to lowercase", () => {
        expect(normalizeInstructorEmail(" John.Smith@aau.edu.et ")).toBe("john.smith@aau.edu.et");
    });

    it("login email is trimmed only", () => {
        expect(normalizeLoginEmail(" Admin@uni.test ")).toBe("Admin@uni.test");
    });
});
