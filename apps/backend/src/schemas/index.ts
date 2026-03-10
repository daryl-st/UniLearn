import { z } from "zod";
// import type { Role, Difficulty } from "@unilearn/shared-types";

const email = z.email().max(255);
const password = z.string().min(8).max(128);
const name = z.string().min(1).max(100);
// const role = z.enum(Role);

// Auth
export const registerSchema = z.object({
    email,
    password,
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
// ...