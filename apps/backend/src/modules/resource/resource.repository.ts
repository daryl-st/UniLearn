import type { FileType, ResourceStatus } from "@prisma/client";
import prisma from "../../config/db.js";
import { Course, Resource } from "./resource.entity.js";
import type { IngestChunk } from "../ai/ai.service.js";

export class ResourceRepository {
    async findChunksWithEmbeddings(resourceId: string): Promise<
        Array<{
            chunkIndex: number;
            pageNumber: number;
            content: string;
            embedding: number[];
        }>
    > {
        const rows = await prisma.resourceChunk.findMany({
            where: {
                resourceId,
            },
            orderBy: {
                chunkIndex: "asc",
            },
        });
        return rows
            .filter((r) => Array.isArray(r.embedding) && r.embedding.length > 0)
            .map((r) => ({
                chunkIndex: r.chunkIndex,
                pageNumber: r.pageNumber,
                content: r.content,
                embedding: r.embedding,
            }));
    }

    async findAll(courseId: string): Promise<Resource[]> {
        const resources = await prisma.resource.findMany({
            where: { courseId: courseId }
        });

        return resources.map(u => new Resource({ 
            id: u.id, 
            title: u.title, 
            type: u.type, 
            fileUrl: u.fileUrl, 
            version: u.version, 
            instructorId: u.instructorId, 
            courseId: u.courseId, 
            isDeleted: u.isDeleted 
        }));
    }

    async findOne(data: {id: string}): Promise<Resource | null> {
        const resource = await prisma.resource.findUnique({ 
            where: { id: data.id}
        });
        if (!resource) return null; // Not found

        return new Resource({ 
            id: resource?.id, 
            title: resource?.title, 
            type: resource?.type, 
            fileUrl: resource?.fileUrl, 
            version: resource?.version, 
            instructorId: resource?.instructorId, 
            courseId: resource?.courseId, 
            isDeleted: resource?.isDeleted 
        });
    }

    async findByCourseId(data: {id: string}): Promise<Resource[] | null> {
        const resources = await prisma.resource.findMany({
            where: { courseId: data.id }
        });
        if (!resources) return null; // no resources found
        return resources.map(u => new Resource({ 
            id: u.id, 
            title: u.title, 
            type: u.type, 
            fileUrl: u.fileUrl, 
            version: u.version, 
            instructorId: u.instructorId, 
            courseId: u.courseId, 
            isDeleted: u.isDeleted 
        }));
    }

    async create(data: {
        title: string;
        type: FileType;
        fileUrl: string;
        version: number;
        instructorId: string;
        courseId: string;
        status?: ResourceStatus;
    }): Promise<Resource | null> {
        // fileUrl is unique to prevent duplicate file uploads
        const existingResource = await prisma.resource.findUnique({ where: {fileUrl: data.fileUrl }});
        if (existingResource) return null;

        const existingResourceByTitle = await prisma.resource.findFirst({
            where: {
                courseId: data.courseId,
                title: data.title,
            }
        });
        if (existingResourceByTitle) return null;

        const resource = await prisma.resource.create({ data });
        return new Resource({ 
            id: resource.id, 
            title: resource.title, 
            type: resource.type, 
            fileUrl: resource.fileUrl, 
            version: resource.version, 
            instructorId: resource.instructorId, 
            courseId: resource.courseId, 
            isDeleted: resource.isDeleted 
        });
    }

    async delete(data: { id: string }): Promise<Resource | null > { 
        // soft delete 
        // const resource = await prisma.resource.update({ where: {id: data.id}, data: {isDeleted: true} });
        const resource = await prisma.resource.delete({ where: {id: data.id}});
        if (!resource) return null;
        return resource;
    }

    async updateStatus(resourceId: string, status: ResourceStatus): Promise<void> {
        await prisma.resource.update({
            where: { id: resourceId },
            data: { status },
        });
    }

    async upsertChunks(resourceId: string, chunks: IngestChunk[]): Promise<void> {
        await prisma.$transaction(
            chunks.map((chunk) =>
                prisma.resourceChunk.upsert({
                    where: {
                        resourceId_chunkIndex: {
                            resourceId,
                            chunkIndex: chunk.chunk_index,
                        },
                    },
                    update: {
                        pageNumber: chunk.page_number,
                        content: chunk.content,
                        tokenCount: chunk.token_count,
                        embedding: chunk.embedding ?? [],
                    },
                    create: {
                        resourceId,
                        chunkIndex: chunk.chunk_index,
                        pageNumber: chunk.page_number,
                        content: chunk.content,
                        tokenCount: chunk.token_count,
                        embedding: chunk.embedding ?? [],
                    },
                }),
            ),
        );
    }
}

export class CourseRepository {
    async findAll(): Promise<Course[]> {
        const courses = await prisma.course.findMany(); // we might not need to fetch id for this request
        return courses.map(u => new Course({ 
            id: u.id, 
            name: u.name, 
            code: u.code, 
            acadamicYear: u.acadamicYear, 
            instructorId: u.instructorId, 
            departmentId: u.departmentId 
        })); 
    };

    async findOne(data: {id: string}): Promise<Course | null> {
        const course = await prisma.course.findUnique({ where: {id: data.id} });
        if (!course) return null;
        return new Course({ 
            id: course.id, 
            name: course.name, 
            code: course.code, 
            acadamicYear: course.acadamicYear, 
            instructorId: course.instructorId, 
            departmentId: course.departmentId 
        });
    }

    async findOneByCode(code: string): Promise<Course | null> { // we can just make this boolean if the use-case allows it
        const course = await prisma.course.findUnique({ where: {code: code }});
        if (!course) return null;
        return new Course({ 
            id: course.id, 
            name: course.name, 
            code: course.code, 
            acadamicYear: course.acadamicYear, 
            instructorId: course.instructorId, 
            departmentId: course.departmentId 
        });
    }

    async create(data: {name: string, code: string, acadamicYear: number, instructorId: string, departmentId: string}): Promise<Course> {
        const course = await prisma.course.create({ data });
        return new Course({ 
            id: course.id,
            name: course.name, 
            code: course.code, 
            acadamicYear: course.acadamicYear, 
            instructorId: course.instructorId, 
            departmentId: course.departmentId 
        });
    }

    // can we delete a course without deleting it's resources? if so, is that valid?
    async delete(data: {id: string}): Promise<Course | null> {
        const course = await prisma.course.delete({ where: {id: data.id }});
        if (!course) return null;
        return course;
    }
}