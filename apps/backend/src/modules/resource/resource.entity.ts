import type { CourseStatus, FileType, Resource as ResourceType, Course as CourseType, ResourceStatus } from "@unilearn/shared-types";
import type { Instructor, Student } from "../user/user.entity.js";

export class Resource {
    id: string;
    title: string;
    type: FileType;
    fileUrl: string;
    version: number;
    isDeleted: boolean;
    courseId: string;
    instructorId?: string;
    status?: ResourceStatus;

    constructor(resourceData: ResourceType) {
        this.id = resourceData.id;
        this.title = resourceData.title;
        this.type = resourceData.type;
        this.fileUrl = resourceData.fileUrl;
        this.version = resourceData.version;
        this.isDeleted = resourceData.isDeleted;
        this.courseId = resourceData.courseId;
        this.instructorId = resourceData.instructorId;
        if (resourceData.status !== undefined) {
            this.status = resourceData.status;
        }
    }
}

export class Course {
    id: string;
    name: string;
    code: string;
    acadamicYear: number;
    instructorId: string | undefined;
    departmentId: string;
    description: string | undefined;
    status: CourseStatus | undefined;
    resources: Resource[] | undefined;
    instructorIds: string[] | undefined;

    constructor(courseData: CourseType) {
        this.id = courseData.id;
        this.name = courseData.name;
        this.code = courseData.code;
        this.acadamicYear = courseData.acadamicYear;
        this.instructorId = courseData.instructorId;
        this.departmentId = courseData.departmentId;
        this.description = courseData.description;
        this.status = courseData.status;
        if (courseData.resources) {
            this.resources = courseData.resources;
        }
    }
}

export class Department {
    id: string;
    name: string;
    code: string;
    students: Student[];
    instructors: Instructor[];
    courses: Course[];

    constructor(departmentData: any) {
        this.id = departmentData.id;
        this.name = departmentData.name;
        this.code = departmentData.code;
        this.students = departmentData.students;
        this.instructors = departmentData.instructors;
        this.courses = departmentData.courses;
    }
}
