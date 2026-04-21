import type { Role } from "@unilearn/shared-types";
import type { User as UserType, Student as StudentType, Instructor as InstructorType } from "@unilearn/shared-types";

// Refactor this class by specifing public, protected and private fields.
export class User implements UserType {
    // These should be private i guess.
    id: string;
    name: string;
    email: string;
    password: string;
    role: Role;
    username?: string; // it's optional.

    constructor(data: UserType) {
        this.id = data.id;
        this.email = data.email;
        this.password = data.password;
        this.name = data.name
        this.role = data.role;
        if (data.username) {
            this.username = data.username;
        }
    }

    canAccessAdminPanel(): boolean {
        return this.role === "ADMIN";
    }

    canAccessInstructorResources(): boolean {
        return this.role === "INSTRUCTOR" || this.role === "ADMIN";
    }

    // updateName 
    updateName(newName: string): void {
        this.name = newName;
    }

    // toJson
    toJson() {
        return {
            id: this.id,
            name: this.name,
            email: this.email,
            username: this.username,
            role: this.role,
        }
    }
}

export class Student extends User implements StudentType { // this should extend User class ??
    studentId: string;
    academicYear: number;
    departmentId: string;

    constructor(data: StudentType) {
        super(data);
        this.studentId = data.studentId;
        this.academicYear = data.academicYear;
        this.departmentId = data.departmentId;
    }

    // i have access to all the methods of the User class, and i can add new ones too.
}

export class Instructor extends User implements InstructorType {
    instructorId: string;

    constructor(data: InstructorType) {
        super(data);
        this.instructorId = data.instructorId;
    }

    // i have access to all the methods of the User class, and i can add new ones too.
}