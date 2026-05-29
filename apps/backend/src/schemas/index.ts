import { z } from "zod";
// import type { Role, Difficulty } from "@unilearn/shared-types";

const email = z.email().max(255);
const password = z.string().min(8).max(128);
const name = z.string().min(1).max(100);
const role = z.enum(["ADMIN", "INSTRUCTOR", "STUDENT"]);

// Auth
export const registerSchema = z.object({
    email,
    password,
    role,
    firstName: name,
    lastName: name,
    username: name.optional().nullable(), // we might not need this 
});
export type RegisterBody = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
    email: z.email(),
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
    departmentId: z.string().uuid(),
});
export type createCourseBody = z.infer<typeof createCourseSchema>

export const uploadResourceSchema = z.object({
    title: name,
    type: z.enum(["PDF", "PPT", "DOC"]),
    fileUrl: z.string().min(1).max(2048),
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

/** Body for DELETE /course/resource/:id — resource id is in the URL. */
export const deleteResourceBodySchema = z.object({
    instructorId: z.string().uuid(),
});
export type deleteResourceBody = z.infer<typeof deleteResourceBodySchema>