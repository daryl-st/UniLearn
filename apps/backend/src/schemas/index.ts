import { z } from "zod";
import { AAU_STUDENT_EMAIL_ERROR, AAU_STUDENT_EMAIL_REGEX, normalizeStudentEmail } from "../modules/Auth/aauEmail.js";
// import type { Role, Difficulty } from "@unilearn/shared-types";

const email = z.email().max(255);
const password = z.string().min(8).max(128);
const name = z.string().min(1).max(100);
const role = z.enum(["ADMIN", "INSTRUCTOR", "STUDENT"]);

// Auth
export const registerSchema = z.object({
    email: email.transform(normalizeStudentEmail).refine((v) => AAU_STUDENT_EMAIL_REGEX.test(v), {
        message: AAU_STUDENT_EMAIL_ERROR,
    }),
    password,
    role,
    firstName: name,
    lastName: name,
    username: name.optional().nullable(), // we might not need this 
});
export type RegisterBody = z.infer<typeof registerSchema>;

export const verifyEmailQuerySchema = z.object({
    token: z.string().min(1),
});
export type VerifyEmailQuery = z.infer<typeof verifyEmailQuerySchema>;

export const loginSchema = z.object({
    email: z.email().max(255).transform((v) => v.trim()),
    password: z.string().min(1),
});
export type LoginBody = z.infer<typeof loginSchema>

export const updateProfile = z.object({
    firstName: name.optional(),
    lastName: name.optional(),
    username: name.optional(),
});
export type ProfileUpdateBody = z.infer<typeof updateProfile>

// Resources
export const createCourseSchema = z.object({
    name: name,
    code: z.string().min(2).max(50),
    acadamicYear: z.number().min(1).max(4),
    instructorId: z.string().uuid(),
    departmentId: z.string().uuid().optional(),
    description: z.string().max(1000).optional(),
    status: z.enum(["ACTIVE", "DRAFT", "ARCHIVED"]).optional(),
});
export type createCourseBody = z.infer<typeof createCourseSchema>

export const updateCourseSchema = z.object({
    name: name.optional(),
    code: z.string().min(2).max(50).optional(),
    acadamicYear: z.number().min(1).max(4).optional(),
    instructorId: z.string().uuid().optional(),
    departmentId: z.string().uuid().optional(),
    description: z.string().max(1000).optional(),
    status: z.enum(["ACTIVE", "DRAFT", "ARCHIVED"]).optional(),
});
export type updateCourseBody = z.infer<typeof updateCourseSchema>

export const assignInstructorSchema = z.object({
    instructorId: z.string().uuid(),
});
export type assignInstructorBody = z.infer<typeof assignInstructorSchema>

export const uploadResourceSchema = z.object({
    title: name,
    type: z.enum(["PDF", "PPT", "DOC"]),
    courseId: z.string().uuid(),
    instructorId: z.string().uuid(),
});
export type uploadResourceBody = z.infer<typeof uploadResourceSchema>

export const ingestResourceSchema = z.object({
    resourceId: z.string().uuid(),
    fileUrl: z.url().max(2048),
});
export type ingestResourceBody = z.infer<typeof ingestResourceSchema>

export const askResourceSchema = z.object({
    resourceId: z.string().uuid(),
    question: z.string().min(1).max(4000),
    topK: z.number().int().min(1).max(20).optional(),
});
export type askResourceBody = z.infer<typeof askResourceSchema>

export const summarizeResourceSchema = z.object({
    resourceId: z.string().uuid(),
    maxChunks: z.number().int().min(1).max(30).optional(),
});
export type summarizeResourceBody = z.infer<typeof summarizeResourceSchema>;

export const listSummariesQuerySchema = z.object({
    resourceId: z.string().uuid(),
});
export type listSummariesQuery = z.infer<typeof listSummariesQuerySchema>;

export const listChatQuerySchema = z.object({
    resourceId: z.string().uuid(),
});
export type listChatQuery = z.infer<typeof listChatQuerySchema>;

const difficultyEnum = z.enum(["EASY", "MEDIUM", "HARD"]);

export const generateQuizSchema = z.object({
    resourceId: z.string().uuid(),
    difficulty: difficultyEnum,
    title: z.string().min(1).max(200).optional(),
    maxChunks: z.number().int().min(1).max(30).optional(),
    questionCount: z.number().int().min(3).max(15).optional(),
});
export type generateQuizBody = z.infer<typeof generateQuizSchema>;

export const listQuizzesQuerySchema = z.object({
    resourceId: z.string().uuid(),
});
export type listQuizzesQuery = z.infer<typeof listQuizzesQuerySchema>;

export const submitQuizSchema = z.object({
    answers: z
        .array(
            z.object({
                questionId: z.string().uuid(),
                answer: z.string().min(0).max(2000),
            }),
        )
        .min(1),
});
export type submitQuizBody = z.infer<typeof submitQuizSchema>;

/** Body for DELETE /course/resource/:id — resource id is in the URL. */
export const deleteResourceBodySchema = z.object({
    instructorId: z.string().uuid(),
});
export type deleteResourceBody = z.infer<typeof deleteResourceBodySchema>

export const changePasswordSchema = z.object({
    password: z.string().min(8).max(128),
});
export type ChangePasswordBody = z.infer<typeof changePasswordSchema>