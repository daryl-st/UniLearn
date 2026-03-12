import type { FileType } from "@unilearn/shared-types";
import type { InstructorProfile, StudentProfile } from "../user/user.entity.js";

export class Resource {
    constructor(
        public id: string,
        public title: string,
        public type: FileType,
        public fileUrl: String,
        // summaries, quizzes and other things will be included 
    ) {}
}

export class Course {
    constructor(
        public id: string,
        public name: string,
        public code: string,
        public acadamicYear: Number,
        public resources?: Resource[], // might need to make it private
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