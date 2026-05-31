import type { FileType, ResourceStatus } from "@prisma/client";
import prisma from "../../config/db.js";
import { Course, Resource } from "./resource.entity.js";
import type { IngestChunk } from "../ai/ai.service.js";
import { resolveCloudinaryViewerUrl } from "./cloudinary.utils.js";

function toResource(row: {
    id: string;
    title: string;
    type: FileType;
    fileUrl: string;
    version: number;
    instructorId: string;
    courseId: string;
    isDeleted: boolean;
    status: ResourceStatus;
}): Resource {
    return new Resource({
        id: row.id,
        title: row.title,
        type: row.type,
        fileUrl: resolveCloudinaryViewerUrl(row.fileUrl, row.type),
        version: row.version,
        instructorId: row.instructorId,
        courseId: row.courseId,
        isDeleted: row.isDeleted,
        status: row.status,
    });
}

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
            where: { courseId: courseId },
        });

        return resources.map((u) => toResource(u));
    }

    async findOne(data: { id: string }): Promise<Resource | null> {
        const resource = await prisma.resource.findUnique({
            where: { id: data.id },
        });
        if (!resource) return null;

        return toResource(resource);
    }

    async findByCloudinaryPublicId(publicId: string): Promise<Resource | null> {
        const resource = await prisma.resource.findUnique({
            where: { cloudinaryPublicId: publicId },
        });
        if (!resource) return null;
        return toResource(resource);
    }

    async findByCourseId(data: { id: string }): Promise<Resource[] | null> {
        const resources = await prisma.resource.findMany({
            where: { courseId: data.id },
        });
        if (!resources) return null;
        return resources.map((u) => toResource(u));
    }

    async create(data: {
        title: string;
        type: FileType;
        fileUrl: string;
        version: number;
        instructorId: string;
        courseId: string;
        status?: ResourceStatus;
        cloudinaryPublicId?: string;
    }): Promise<Resource | null> {
        const existingResource = await prisma.resource.findUnique({ where: { fileUrl: data.fileUrl } });
        if (existingResource) return null;

        const existingResourceByTitle = await prisma.resource.findFirst({
            where: {
                courseId: data.courseId,
                title: data.title,
            },
        });
        if (existingResourceByTitle) return null;

        const resource = await prisma.resource.create({ data });
        return toResource(resource);
    }

    async delete(data: { id: string }): Promise<Resource | null> {
        const resource = await prisma.resource.delete({ where: { id: data.id } });
        if (!resource) return null;
        return resource;
    }

    async updateStatus(resourceId: string, status: ResourceStatus): Promise<void> {
        await prisma.resource.update({
            where: { id: resourceId },
            data: { status },
        });
    }

    async updateFileUrl(resourceId: string, fileUrl: string): Promise<void> {
        await prisma.resource.update({
            where: { id: resourceId },
            data: { fileUrl },
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

    async countAll(): Promise<number> {
        return prisma.resource.count({
            where: { isDeleted: false },
        });
    }

    async countByInstructor(instructorId: string): Promise<number> {
        return prisma.resource.count({
            where: { instructorId, isDeleted: false },
        });
    }

    async getRecentResources(limit: number = 5): Promise<Resource[]> {
        const resources = await prisma.resource.findMany({
            where: { isDeleted: false },
            orderBy: { createdAt: "desc" },
            take: limit,
        });
        return resources.map((u) => toResource(u));
    }

    async getResourceAnalytics(): Promise<{
        byStatus: Record<string, number>;
        byType: Record<string, number>;
    }> {
        const statusGroups = await prisma.resource.groupBy({
            by: ["status"],
            where: { isDeleted: false },
            _count: { _all: true }
        });
        const typeGroups = await prisma.resource.groupBy({
            by: ["type"],
            where: { isDeleted: false },
            _count: { _all: true }
        });
        
        const byStatus: Record<string, number> = {};
        statusGroups.forEach(g => {
            byStatus[g.status] = g._count._all;
        });

        const byType: Record<string, number> = {};
        typeGroups.forEach(g => {
            byType[g.type] = g._count._all;
        });

        return { byStatus, byType };
    }
}

export class CourseRepository {
    async findAll(): Promise<Course[]> {
        const courses = await prisma.course.findMany();
        return courses.map(
            (u) =>
                new Course({
                    id: u.id,
                    name: u.name,
                    code: u.code,
                    acadamicYear: u.acadamicYear,
                    instructorId: u.instructorId ?? "",
                    departmentId: u.departmentId,
                }),
        );
    }

    async findOne(data: { id: string }): Promise<Course | null> {
        const course = await prisma.course.findUnique({ where: { id: data.id } });
        if (!course) return null;
        return new Course({
            id: course.id,
            name: course.name,
            code: course.code,
            acadamicYear: course.acadamicYear,
            instructorId: course.instructorId ?? "",
            departmentId: course.departmentId,
        });
    }

    async findOneByCode(code: string): Promise<Course | null> {
        const course = await prisma.course.findUnique({ where: { code: code } });
        if (!course) return null;
        return new Course({
            id: course.id,
            name: course.name,
            code: course.code,
            acadamicYear: course.acadamicYear,
            instructorId: course.instructorId ?? "",
            departmentId: course.departmentId,
        });
    }

    async create(data: {
        name: string;
        code: string;
        acadamicYear: number;
        instructorId: string;
        departmentId: string;
    }): Promise<Course> {
        const course = await prisma.course.create({ data });
        return new Course({
            id: course.id,
            name: course.name,
            code: course.code,
            acadamicYear: course.acadamicYear,
            instructorId: course.instructorId ?? "",
            departmentId: course.departmentId,
        });
    }

    async delete(data: { id: string }): Promise<Course | null> {
        const course = await prisma.course.delete({ where: { id: data.id } });
        if (!course) return null;
        return new Course({
            id: course.id,
            name: course.name,
            code: course.code,
            acadamicYear: course.acadamicYear,
            instructorId: course.instructorId ?? "",
            departmentId: course.departmentId,
        });
    }

    async countAll(): Promise<number> {
        return prisma.course.count();
    }

    async countByInstructor(instructorId: string): Promise<number> {
        return prisma.course.count({
            where: { instructorId },
        });
    }

    async findByInstructor(instructorId: string): Promise<Course[]> {
        const courses = await prisma.course.findMany({
            where: { instructorId },
        });
        return courses.map(
            (u) =>
                new Course({
                    id: u.id,
                    name: u.name,
                    code: u.code,
                    acadamicYear: u.acadamicYear,
                    instructorId: u.instructorId ?? "",
                    departmentId: u.departmentId,
                }),
        );
    }

    async getRecentCourses(limit: number = 5): Promise<Course[]> {
        const courses = await prisma.course.findMany({
            orderBy: { createdAt: "desc" },
            take: limit,
        });
        return courses.map(
            (u) =>
                new Course({
                    id: u.id,
                    name: u.name,
                    code: u.code,
                    acadamicYear: u.acadamicYear,
                    instructorId: u.instructorId ?? "",
                    departmentId: u.departmentId,
                }),
        );
    }

    async getInstructorCourseStats(): Promise<{ totalCourses: number; mappedCourses: number }> {
        const totalCourses = await prisma.course.count();
        const mappedCourses = await prisma.course.count({
            where: {
                NOT: {
                    instructorId: null
                }
            }
        });
        return { totalCourses, mappedCourses };
    }
}
