import type { FileType } from "@unilearn/shared-types";
import type { CourseRepository, ResourceRepository } from "./resource.repository.js";

export class ResourceService {
    constructor(private resourceRepositor: ResourceRepository) {}

    async getResources() {
        return this.resourceRepositor.findAll();
    }

    async uploadResource(data: {title: string, type: FileType, fileUrl: string}) {
        // other business logic like if it already exists or some other things
        return this.resourceRepositor.create(data);
    }

    async getResourceById(data: { id: string }) {
        return this.resourceRepositor.findOne(data);
    }
}

export class CourseService {
    constructor(private courseRepositor: CourseRepository) {}

    async getCourses() {
        return this.courseRepositor.findAll();
    }

    async getCourseById(data: { id: string }) {
        return this.courseRepositor.findOne(data);
    }

    async createCourse(data: {name: string, code: string, acadamicYear: number}) {
        return this.courseRepositor.create(data);
    } 
}