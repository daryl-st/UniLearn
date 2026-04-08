import type { FileType } from "@unilearn/shared-types";
import type { InstructorProfile, StudentProfile } from "../user/user.entity.js";

export class Resource {
    constructor(
        public id: string,
        public title: string,
        public type: FileType,
        public fileUrl: String,
        public version: number, // might need to change this to float
        public instructorId?: string
        // summaries, quizzes and other things will be included 
    ) {}
}

export class Course {
    constructor(
        public id: string,
        public name: string,
        public code: string,
        public acadamicYear: Number, 
        public instructorId: string,
        public departmentId: string,
        public resources?: Resource[], // doesn't neccessarily need to have one always.
    ) {}
}

export class CourseResponse {
    constructor(
        public id: string,
        public name: string,
        public code: string,
        public acadamicYear: Number,
        public instructorName?: string,
        public departmentName?: string,
    ) {}
}

export class Department {
    constructor(
        public id: string,
        public name: string,
        public code: string,

        public students: StudentProfile[], // not sure it referes to the user class tho
        public instructor: InstructorProfile[],
        public courses: Course[],
    ) {}
}