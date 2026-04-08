import type { FileType } from "@prisma/client";
import prisma from "../../config/db.js";
import { Course, Resource } from "./resource.entity.js";

export class ResourceRepository {
    async findAll(courseId: string): Promise<Resource[]> {
        const resources = await prisma.resource.findMany({
            where: { courseId: courseId }
        });
        return resources.map(u => new Resource(u.id, u.title, u.type, u.fileUrl, u.version, u.instructorId));
    }

    async findOne(data: {id: string}): Promise<Resource | null> {
        const resource = await prisma.resource.findUnique({ 
            where: { id: data.id}
        });
        if (!resource) return null; // Not found
        return new Resource(resource?.id, resource?.title, resource?.type, resource?.fileUrl, resource?.version, resource?.instructorId);
    }

    async findByCourseId(data: {id: string}): Promise<Resource[] | null> {
        const resources = await prisma.resource.findMany({
            where: { courseId: data.id }
        });
        if (!resources) return null; // no resources found
        return resources.map(u => new Resource(u.id, u.title, u.type, u.fileUrl, u.version));
    }

    async create(data: {title: string, type: FileType, fileUrl: string, version: number, instructorId: string, courseId: string}) : Promise<Resource | null> {
        // fileUrl is unique to prevent duplicate file uploads
        const existingResource = await prisma.resource.findUnique({ where: {fileUrl: data.fileUrl }});
        if (existingResource) return null;

        const resource = await prisma.resource.create({ data });
        return new Resource(resource.id, resource.title, resource.type, resource.fileUrl, resource.version);
    }

    async delete(data: { id: string }): Promise<Resource | null > { 
        // soft delete 
        // const resource = await prisma.resource.update({ where: {id: data.id}, data: {isDeleted: true} });
        const resource = await prisma.resource.delete({ where: {id: data.id}});
        if (!resource) return null;
        return resource;
    }
}

export class CourseRepository {
    async findAll(): Promise<Course[]> {
        const courses = await prisma.course.findMany(); // we might not need to fetch id for this request
        return courses.map(u => new Course(u.id, u.name, u.code, u.acadamicYear, u.instructorId, u.departmentId)); 
    };

    async findOne(data: {id: string}): Promise<Course | null> {
        const course = await prisma.course.findUnique({ where: {id: data.id} });
        if (!course) return null;
        return new Course(course.id, course.name, course.code, course.acadamicYear, course.instructorId, course.departmentId);
    }

    async findOneByCode(code: string): Promise<Course | null> { // we can just make this boolean if the use-case allows it
        const course = await prisma.course.findUnique({ where: {code: code }});
        if (!course) return null;
        return new Course(course.id, course.name, course.code, course.acadamicYear, course.instructorId, course.departmentId);
    }

    async create(data: {name: string, code: string, acadamicYear: number, instructorId: string, departmentId: string}): Promise<Course> {
        const course = await prisma.course.create({ data });
        return new Course(course.id, course.name, course.code, course.acadamicYear, course.instructorId, course.departmentId);
    }

    // can we delete a course without deleting it's resources? if so, is that valid?
    async delete(data: {id: string}): Promise<Course | null> {
        const course = await prisma.course.delete({ where: {id: data.id }});
        if (!course) return null;
        return course;
    }
}