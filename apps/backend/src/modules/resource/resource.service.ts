import type { FileType } from "@unilearn/shared-types";
import type { CourseRepository, ResourceRepository } from "./resource.repository.js";
import { Course, Resource } from "./resource.entity.js";
import type { UserRepository } from "../user/user.repository.js";

export class ResourceService {
    constructor(private resourceRepository: ResourceRepository) {}

    async getResources(courseId: string): Promise<Resource[]> {
        return this.resourceRepository.findAll(courseId);
    }

    async uploadResource(data: {
        title: string;
        type: FileType;
        fileUrl: string;
        version: number;
        instructorId: string;
        courseId: string;
    }) {
        const resource = await this.resourceRepository.create(data);
        if (!resource) return "Resource already exists";

        return resource;
    }

    async getResourceByCourseId(data: { id: string }) {
        return this.resourceRepository.findByCourseId(data);
    }

    async getResourceById(data: { id: string }) {
        return this.resourceRepository.findOne(data);
    }

    async deleteResource(data: { id: string }, instructorId: string) {
        const resource = await this.resourceRepository.findOne(data);
        if (!resource) return "Resource not found!";
        if (resource.instructorId != instructorId) return "Permission Denied!";
        return this.resourceRepository.delete(data);
    }
}

export class CourseService {
    constructor(
        private courseRepository: CourseRepository,
        private userRepository: UserRepository,
    ) {}

    /** Catalog rows: real `instructorId` UUID plus display name for UIs. */
    async getCourses(): Promise<
        Array<{
            id: string;
            name: string;
            code: string;
            acadamicYear: number;
            instructorId: string;
            departmentId: string;
            instructorName: string;
        }>
    > {
        const response = await this.courseRepository.findAll();
        const instructorIds = response.map((course) => course.instructorId);

        const instructorNames = await Promise.all(
            instructorIds.map((id) => this.userRepository.getUserNameById(id)),
        );
        return response.map((course, i) => ({
            id: course.id,
            name: course.name,
            code: course.code,
            acadamicYear: course.acadamicYear,
            instructorId: course.instructorId,
            departmentId: course.departmentId,
            instructorName: instructorNames[i] ?? "",
        }));
    }

    async getCourseById(data: { id: string }) {
        return this.courseRepository.findOne(data);
    }

    async createCourse(data: {
        name: string;
        code: string;
        acadamicYear: number;
        instructorId: string;
        departmentId: string;
    }): Promise<Course | string> {
        const existing = await this.courseRepository.findOneByCode(data.code);
        if (existing) {
            return "Course Already Exists!";
        }
        return this.courseRepository.create(data);
    }

    async deleteCourse(data: { id: string }): Promise<Course | string> {
        const course = await this.courseRepository.findOne(data);
        if (!course) return "Course Not Found!";
        const deleted = await this.courseRepository.delete(data);
        if (!deleted) return "Course Not Found!";
        return new Course({
            id: deleted.id,
            name: deleted.name,
            code: deleted.code,
            acadamicYear: deleted.acadamicYear,
            instructorId: deleted.instructorId,
            departmentId: deleted.departmentId,
        });
    }
}
