import type { FileType } from "@unilearn/shared-types";
import type { CourseRepository, ResourceRepository } from "./resource.repository.js";
import { Resource, type Course } from "./resource.entity.js";

export class ResourceService {
    constructor(private resourceRepositor: ResourceRepository) {}

    async getResources(courseId: string): Promise<Resource[] | String> {
        const resource = this.resourceRepositor.findAll(courseId);
        if ((await resource).length == 0) {
            return "No resources available for this course"; // centralize validation
        } 
        return resource;
    };

    async uploadResource(data: { title: string, type: FileType, fileUrl: string, instructorId: string, courseId: string }) {
        // other business logic here...
        return this.resourceRepositor.create(data);
    }

    async getResourceByCourseId(data: { id: string}) {
        return this.resourceRepositor.findByCourseId(data);
    }

    async getResourceById(data: { id: string }) {
        return this.resourceRepositor.findOne(data);
    }

    async deleteResource(data: { id: string }, instructorId: string ) {
        // we need to make sure the instructor is deleting only his uploads
        const resource = await this.resourceRepositor.findOne(data)
        if (!resource) return "Course Not Found!" // centralize
        if (resource?.instructorId != instructorId) return "Permission Denied!"; // centralize
        return this.resourceRepositor.delete(data);
    }
}

export class CourseService {
    constructor(private courseRepositor: CourseRepository) {}

    async getCourses(): Promise<Course[]> {
        return this.courseRepositor.findAll();
    }

    async getCourseById(data: { id: string }) {
        return this.courseRepositor.findOne(data);
    }

    async createCourse(data: {name: string, code: string, acadamicYear: number, instructorId: string, departmentId: string}): Promise<Course | String> {
        // we have to check if the course exists already
        const course = this.courseRepositor.findOneByCode(data.code);
        if (!course) {
            return "Course Already Exists!"; // centralize validation with zod    
        }
        return this.courseRepositor.create(data);
    } 

    async deleteCourse(data: {id: string}): Promise<Course | String> {
        const course = await this.courseRepositor.findOne(data);
        if (!course) return "Course Not Found!";
        return this.deleteCourse(data);
    }
}