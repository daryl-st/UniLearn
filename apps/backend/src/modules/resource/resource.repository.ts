import type { FileType } from "@prisma/client";
import prisma from "../../config/db.js";
import { Course, Resource } from "./resource.entity.js";

export class ResourceRepository {
    async findAll(): Promise<Resource[]> {
        const resources = await prisma.resource.findMany();
        return resources.map(u => new Resource(u.id, u.title, u.type, u.fileUrl));
    }

    async findOne(data: {id: string}): Promise<Resource | null> {
        const resource = await prisma.resource.findUnique({ 
            where: { id: data.id}
        });
        if (!resource) return null; // Not found
        return new Resource(resource?.id, resource?.title, resource?.type, resource?.fileUrl);
    }

    async create(data: {title: string, type: FileType, fileUrl: string}) : Promise<Resource> {
        const resource = await prisma.resource.create({ data }); // i might need summaries and quizzes here ??
        return new Resource(resource.id, resource.title, resource.type, resource.fileUrl);
    } 
}

export class CourseRepository {
    async findAll(): Promise<Course[]> {
        const courses = await prisma.course.findMany();
        return courses.map(u => new Course(u.id, u.name, u.code, u.acadamicYear)); // we need to have serious descussion about resources
    };

    async findOne(data: {id: string}): Promise<Course | null> {
        const course = await prisma.course.findUnique({ where: {id: data.id} });
        if (!course) return null;
        return new Course(course.id, course.name, course.code, course.acadamicYear);
    }

    async create(data: {name: string, code: string, acadamicYear: Number}): Promise<Course> {
        const course = await prisma.course.create({ data });
        return new Course(course.id, course.name, course.code, course.acadamicYear);
    }
}