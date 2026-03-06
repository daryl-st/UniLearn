import type { Role } from "@unilearn/shared-types";

export class User {
    constructor(
        public id: string,
        public email: string,
        public password: string,
        public firstName: string,
        public lastName: string,
        public role: Role,
        public username?: null,
    ) {}

    // updateName 
}

export class StudentProfile {
    constructor(
        public id: string,
        public studentId: string,
        public departmentId: string,
        public acadamicYear: Number
    ) {}
}

export class InstructorProfile {
    constructor(
        public id: string,
        public instructorId: string,
        public departmentId: string
    ) {}
}