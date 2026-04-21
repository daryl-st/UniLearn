export type Role = "STUDENT" | "INSTRUCTOR" | "ADMIN";

// base user type.
export interface User {
    id: string;
    name: string
    email: string;
    password: string;
    username?: string;
    role: Role;
    // createdAt: Date;
}

// we can use extends to describe the StudentUser...using basic inheritance.
export interface Student extends User {
    studentId: string;
    departmentId: string;
    academicYear: number;
}

export interface Instructor extends User {
    instructorId: string;
}

// API response for user detailes when registering
export interface CreateUserInputRegister {
    email: string;
    password: string; 
    username?: string;
    name: string
    // role: Role; // i don't need to receive this from the frontend, it is set to STUDENT by default
    // createdAt: Date; // why? only need it when storing in the database, not when receiving from the frontend
}

// API response for user detailes when logging in.
export interface CreateUserInputLogin {
    email: string;
    password: string;
}

// API response for user detailes when updating the profile.
// We will keep everything optional here, because the user can update any of these fields, or even just one of them.
export interface UpdateUserInput {
    username?: string;
    firstName?: string;
    lastName?: string;
}

// there's something called intersection types in TypeScript, 
// in which we can create a type based on two types as combination and it's very flexible
