export type Role = "STUDENT" | "INSTRUCTOR" | "ADMIN";

// This is returned to the frontend
export interface User {
    id: string; // Not neccessary i think
    email: string; // No password too
    username: string;
    firstName: string;
    lastName: string;
    role: Role;
    createdAt: Date;
}

// Recieved from the frontend
export interface CreateUserInput {
    email: string;
    passwordHash: string;
    username: string;
    firstName: string;
    lastName: string;
    role: Role;
    createdAt: Date;
}

export interface CreateUserInputLogin {
    email: string;
    passwordHash: string;
}

export interface UpdateUserInput {
    username?: string;
    firstName?: string;
    lastName?: string;
}

// we can use extends to describe the StudentUser...
export interface Student extends User {
    studnetId: string;
    acadamicYear: Number;
}

export interface Instructor extends User {
    instructorId: string;
}
