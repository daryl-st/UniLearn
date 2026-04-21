import type { FileType, Resource as ResourceType, Course as CourseType } from "@unilearn/shared-types";
import type { Instructor, Student } from "../user/user.entity.js";

export class Resource {
    id: string;
    title: string;
    type: FileType;
    fileUrl: String;
    version: number; // might need to change this to float
    isDeleted: boolean;
    courseId: string;
    instructorId?: string;

    constructor(resourceData: ResourceType){
        this.id = resourceData.id;
        this.title = resourceData.title;
        this.type = resourceData.type;
        this.fileUrl = resourceData.fileUrl;
        this.version = resourceData.version;
        this.isDeleted = resourceData.isDeleted;
        this.courseId = resourceData.courseId;
        this.instructorId = resourceData.instructorId;
    }

    // this will be automatically called when we return the resource object in the API response, 
    // so we can use it to hide any sensitive data if needed.
    // toJson() {
    //     return {
    //         id: this.id,
    //         title: this.title,
    //         type: this.type,
    //         fileUrl: this.fileUrl,
    //         version: this.version,
    //         isDeleted: this.isDeleted,
    //         courseId: this.courseId,
    //         instructorId: this.instructorId
    //     }
    // }
}

export class Course {
    id: string;
    name: string;
    code: string;
    acadamicYear: number; 
    instructorId: string;
    departmentId: string;
    resources?: Resource[]; // doesn't neccessarily need to have one always.

    // summaries quizzes will be included as needed.

    constructor(courseData: CourseType){
        this.id = courseData.id;
        this.name = courseData.name;
        this.code = courseData.code;
        this.acadamicYear = courseData.acadamicYear;
        this.instructorId = courseData.instructorId;
        this.departmentId = courseData.departmentId;
        if (courseData.resources) {
            this.resources = courseData.resources;
        }
    }

    // toJson
    // toJson() {
    //     return {
    //         id: this.id,
    //         name: this.name,
    //         code: this.code,
    //         acadamicYear: this.acadamicYear,
    //         instructorId: this.instructorId,
    //         departmentId: this.departmentId,
    //         // resources: this.resources ? this.resources.map(resource => resource.toJson()) : undefined
    //     }
    // }
}

export class Department {
    id: string;
    name: string;
    code: string;
    students: Student[];
    instructors: Instructor[];
    courses: Course[];

    // under-development.
    constructor(departmentData: any){
        this.id = departmentData.id;
        this.name = departmentData.name;
        this.code = departmentData.code;
        this.students = departmentData.students;
        this.instructors = departmentData.instructors;
        this.courses = departmentData.courses;
    }
}