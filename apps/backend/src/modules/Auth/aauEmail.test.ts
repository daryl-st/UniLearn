import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { AAU_STUDENT_EMAIL_REGEX, isAauStudentEmail, normalizeLoginEmail, normalizeStudentEmail } from "./aauEmail.js";

describe("aauEmail", () => {
    it("accepts valid AAU undergraduate emails", () => {
        assert.equal(isAauStudentEmail("john.smith-ug@aau.edu.et"), true);
        assert.equal(isAauStudentEmail("sara.bekele-ug@aau.edu.et"), true);
        assert.equal(AAU_STUDENT_EMAIL_REGEX.test("John.Smith-ug@aau.edu.et"), true);
    });

    it("rejects invalid emails", () => {
        assert.equal(isAauStudentEmail("john@gmail.com"), false);
        assert.equal(isAauStudentEmail("smith@aau.edu.et"), false);
        assert.equal(isAauStudentEmail("johnsmith-ug@aau.edu"), false);
        assert.equal(isAauStudentEmail("john.smith@aau.edu.et"), false);
        assert.equal(isAauStudentEmail("john@outlook.com"), false);
    });

    it("normalizes email to lowercase", () => {
        assert.equal(normalizeStudentEmail(" John.Smith-UG@aau.edu.et "), "john.smith-ug@aau.edu.et");
    });

    it("login email is trimmed only", () => {
        assert.equal(normalizeLoginEmail(" Admin@uni.test "), "Admin@uni.test");
    });
});
