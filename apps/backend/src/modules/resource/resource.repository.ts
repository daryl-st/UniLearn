import type { CourseStatus, FileType, ResourceStatus } from "@prisma/client";
import prisma from "../../config/db.js";
import { Course, Resource } from "./resource.entity.js";
import type { IngestChunk } from "../ai/ai.service.js";
import { resolveCloudinaryViewerUrl, isCloudinaryDeliveryUrl } from "./cloudinary.utils.js";

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
            where: {
                courseId,
                isDeleted: false,
                fileUrl: { contains: "res.cloudinary.com" },
            },
        });

        return resources.map((u) => toResource(u));
    }

    async findOne(data: { id: string }): Promise<Resource | null> {
        const resource = await prisma.resource.findUnique({
            where: { id: data.id },
        });
        if (!resource || resource.isDeleted || !isCloudinaryDeliveryUrl(resource.fileUrl)) return null;

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
            where: {
                courseId: data.id,
                isDeleted: false,
                fileUrl: { contains: "res.cloudinary.com" },
            },
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

        if (!isCloudinaryDeliveryUrl(data.fileUrl)) {
            return null;
        }

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
            where: { isDeleted: false, fileUrl: { contains: "res.cloudinary.com" } },
        });
    }

    async countByInstructor(instructorId: string): Promise<number> {
        return prisma.resource.count({
            where: { instructorId, isDeleted: false, fileUrl: { contains: "res.cloudinary.com" } },
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

interface CourseRow {
    id: string;
    name: string;
    code: string;
    description?: string | null;
    acadamicYear: number;
    status: CourseStatus;
    instructorId?: string | null;
    departmentId: string;
    instructors?: Array<{
        instructor: {
            id: string;
            name: string;
        };
    }>;
}

function toCourse(row: CourseRow): Course {
    const course = new Course({
        id: row.id,
        name: row.name,
        code: row.code,
        acadamicYear: row.acadamicYear,
        instructorId: row.instructorId ?? undefined,
        departmentId: row.departmentId,
        description: row.description ?? undefined,
        status: row.status,
    });
    if (row.instructors) {
        course.instructorIds = row.instructors.map((item) => item.instructor.id);
    }
    return course;
}

export class CourseRepository {
    async findAll(): Promise<Course[]> {
        const courses = await prisma.course.findMany({
            include: {
                instructors: {
                    include: {
                        instructor: {
                            select: { id: true, name: true },
                        },
                    },
                },
            },
        });
        return courses.map(toCourse);
    }

    async findOne(data: { id: string }): Promise<Course | null> {
        const course = await prisma.course.findUnique({
            where: { id: data.id },
            include: {
                instructors: {
                    include: { instructor: { select: { id: true, name: true } } },
                },
            },
        });
        if (!course) return null;
        return toCourse(course);
    }

    async findOneByCode(code: string): Promise<Course | null> {
        const course = await prisma.course.findUnique({
            where: { code },
            include: {
                instructors: {
                    include: { instructor: { select: { id: true, name: true } } },
                },
            },
        });
        if (!course) return null;
        return toCourse(course);
    }

    async create(data: {
        name: string;
        code: string;
        acadamicYear: number;
        instructorId?: string | undefined;
        departmentId: string;
        description?: string | undefined;
        status?: CourseStatus | undefined;
    }): Promise<Course> {
        const createData: Record<string, unknown> = {
            name: data.name,
            code: data.code,
            acadamicYear: data.acadamicYear,
            departmentId: data.departmentId,
        };
        if (data.instructorId !== undefined) createData.instructorId = data.instructorId;
        if (data.description !== undefined) createData.description = data.description;
        if (data.status !== undefined) createData.status = data.status;

        const course = await prisma.course.create({ data: createData as any });
        return toCourse({
            id: course.id,
            name: course.name,
            code: course.code,
            description: course.description,
            acadamicYear: course.acadamicYear,
            instructorId: course.instructorId,
            departmentId: course.departmentId,
            status: course.status,
            instructors: [],
        });
    }

    async update(data: {
        id: string;
        name?: string | undefined;
        code?: string | undefined;
        acadamicYear?: number | undefined;
        instructorId?: string | undefined;
        departmentId?: string | undefined;
        description?: string | undefined;
        status?: CourseStatus | undefined;
    }): Promise<Course | null> {
        const updateData: Record<string, unknown> = {};
        if (data.name !== undefined) updateData.name = data.name;
        if (data.code !== undefined) updateData.code = data.code;
        if (data.acadamicYear !== undefined) updateData.acadamicYear = data.acadamicYear;
        if (data.instructorId !== undefined) updateData.instructorId = data.instructorId;
        if (data.departmentId !== undefined) updateData.departmentId = data.departmentId;
        if (data.description !== undefined) updateData.description = data.description;
        if (data.status !== undefined) updateData.status = data.status;

        const course = await prisma.course.update({
            where: { id: data.id },
            data: updateData,
            include: {
                instructors: {
                    include: { instructor: { select: { id: true, name: true } } },
                },
            },
        });
        return toCourse(course);
    }

    async delete(data: { id: string }): Promise<Course | null> {
        const course = await prisma.course.delete({ where: { id: data.id } });
        if (!course) return null;
        return new Course({
            id: course.id,
            name: course.name,
            code: course.code,
            acadamicYear: course.acadamicYear,
            instructorId: course.instructorId ?? undefined,
            departmentId: course.departmentId,
            description: course.description ?? undefined,
            status: course.status,
        });
    }

    async countAll(): Promise<number> {
        return prisma.course.count();
    }

    async countByInstructor(instructorId: string): Promise<number> {
        return prisma.courseInstructor.count({
            where: { instructorId },
        });
    }

    async findByInstructor(instructorId: string): Promise<Course[]> {
        const courses = await prisma.course.findMany({
            where: {
                instructors: {
                    some: { instructorId },
                },
            },
            include: {
                instructors: {
                    include: { instructor: { select: { id: true, name: true } } },
                },
            },
        });
        return courses.map(toCourse);
    }

    async getRecentCourses(limit: number = 5): Promise<Course[]> {
        const courses = await prisma.course.findMany({
            orderBy: { createdAt: "desc" },
            take: limit,
            include: {
                instructors: {
                    include: { instructor: { select: { id: true, name: true } } },
                },
            },
        });
        return courses.map(toCourse);
    }

    async getInstructorCourseStats(): Promise<{ totalCourses: number; mappedCourses: number }> {
        const totalCourses = await prisma.course.count();
        const mappedCourses = await prisma.course.count({
            where: {
                instructors: {
                    some: {},
                },
            },
        });
        return { totalCourses, mappedCourses };
    }

    async assignInstructor(courseId: string, instructorId: string): Promise<void> {
        await prisma.courseInstructor.upsert({
            where: {
                courseId_instructorId: {
                    courseId,
                    instructorId,
                },
            },
            update: {},
            create: {
                courseId,
                instructorId,
            },
        });
    }

    async unassignInstructor(courseId: string, instructorId: string): Promise<void> {
        await prisma.courseInstructor.delete({
            where: {
                courseId_instructorId: {
                    courseId,
                    instructorId,
                },
            },
        });
    }

    async findCourseInstructors(courseId: string): Promise<Array<{ id: string; name: string }>> {
        const course = await prisma.course.findUnique({
            where: { id: courseId },
            include: {
                instructors: {
                    include: { instructor: { select: { id: true, name: true } } },
                },
            },
        });
        if (!course?.instructors) return [];
        return course.instructors.map((item) => ({
            id: item.instructor.id,
            name: item.instructor.name,
        }));
    }

    async isInstructorAssigned(courseId: string, instructorId: string): Promise<boolean> {
        const assignment = await prisma.courseInstructor.findUnique({
            where: {
                courseId_instructorId: {
                    courseId,
                    instructorId,
                },
            },
        });
        return Boolean(assignment);
    }
}
