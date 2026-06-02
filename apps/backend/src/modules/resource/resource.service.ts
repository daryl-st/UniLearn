import type { CourseStatus, FileType, IngestStatus } from "@unilearn/shared-types";
import type { CourseRepository, ResourceRepository } from "./resource.repository.js";
import { Course, Resource } from "./resource.entity.js";
import prisma from "../../config/db.js";
import type { UserRepository } from "../user/user.repository.js";
import { proxyIngestResource, type IngestResponseBody } from "../ai/ai.service.js";
import { cloudinaryService } from "./cloudinary.service.js";
import {
    isConversionComplete,
    isConversionFailure,
    parseCloudinaryPublicId,
} from "./cloudinary.utils.js";

type UploadResourceSuccess = {
    ok: true;
    resource: Resource;
    ingestStatus: IngestStatus;
};
type UploadResourceConflict = { ok: false; kind: "conflict"; message: string };
type ReindexResourceSuccess = {
    ok: true;
    status: "READY" | "FAILED";
    ingestStatus: IngestStatus;
    chunkCount: number;
};
type ReindexResourceFailure = {
    ok: false;
    statusCode: number;
    message: string;
};

export type UploadResourceResult = UploadResourceSuccess | UploadResourceConflict;
export type ReindexResourceResult = ReindexResourceSuccess | ReindexResourceFailure;

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
        cloudinaryPublicId?: string;
        needsConversion?: boolean;
    }): Promise<UploadResourceResult> {
        const initialStatus = "PROCESSING";

        const resource = await this.resourceRepository.create({
            title: data.title,
            type: data.type,
            fileUrl: data.fileUrl,
            version: data.version,
            instructorId: data.instructorId,
            courseId: data.courseId,
            status: initialStatus,
            ...(data.cloudinaryPublicId ? { cloudinaryPublicId: data.cloudinaryPublicId } : {}),
        });
        if (!resource) {
            return { ok: false, kind: "conflict", message: "Resource already exists" };
        }

        if (data.needsConversion) {
            return { ok: true, resource, ingestStatus: "pending" };
        }

        void this.ingestResourceAsync(resource.id, String(resource.fileUrl));
        return { ok: true, resource, ingestStatus: "pending" };
    }

    async ingestResourceAsync(resourceId: string, pdfUrl: string): Promise<IngestStatus> {
        await this.resourceRepository.updateStatus(resourceId, "PROCESSING");
        try {
            const ingest = await proxyIngestResource(resourceId, pdfUrl);
            if (!ingest.ok) {
                await this.resourceRepository.updateStatus(resourceId, "FAILED");
                return "failed";
            }

            const body = ingest.body as IngestResponseBody;
            const chunks = body.chunks ?? [];
            if (chunks.length === 0) {
                await this.resourceRepository.updateStatus(resourceId, "FAILED");
                return "failed";
            }
            await this.resourceRepository.upsertChunks(resourceId, chunks);
            await this.resourceRepository.updateStatus(resourceId, "READY");
            return "ready";
        } catch {
            await this.resourceRepository.updateStatus(resourceId, "FAILED");
            return "failed";
        }
    }

    async reindexResource(data: { resourceId: string; fileUrl: string }): Promise<ReindexResourceResult> {
        const resource = await this.resourceRepository.findOne({ id: data.resourceId });
        if (!resource) {
            return { ok: false, statusCode: 404, message: "Resource not found." };
        }

        const normalizedUrl = data.fileUrl.trim();
        if (!normalizedUrl) {
            return { ok: false, statusCode: 400, message: "fileUrl is required." };
        }

        await this.resourceRepository.updateStatus(resource.id, "PROCESSING");
        try {
            const ingest = await proxyIngestResource(resource.id, normalizedUrl);
            if (!ingest.ok) {
                await this.resourceRepository.updateStatus(resource.id, "FAILED");
                const message =
                    typeof ingest.body === "object" &&
                    ingest.body !== null &&
                    "detail" in ingest.body
                        ? String((ingest.body as { detail: unknown }).detail)
                        : "Failed to ingest resource.";
                return {
                    ok: false,
                    statusCode: ingest.status,
                    message,
                };
            }

            const body = ingest.body as IngestResponseBody;
            const chunks = body.chunks ?? [];
            if (chunks.length === 0) {
                await this.resourceRepository.updateStatus(resource.id, "FAILED");
                return {
                    ok: true,
                    status: "FAILED",
                    ingestStatus: "failed",
                    chunkCount: 0,
                };
            }
            await this.resourceRepository.upsertChunks(resource.id, chunks);
            await this.resourceRepository.updateStatus(resource.id, "READY");
            return {
                ok: true,
                status: "READY",
                ingestStatus: "ready",
                chunkCount: chunks.length,
            };
        } catch (error) {
            await this.resourceRepository.updateStatus(resource.id, "FAILED");
            return {
                ok: false,
                statusCode: 502,
                message: error instanceof Error ? error.message : "Failed to ingest resource.",
            };
        }
    }

    async handleCloudinaryNotification(payload: Record<string, unknown>): Promise<void> {
        const publicId = parseCloudinaryPublicId(payload);
        if (!publicId) return;

        const resource = await this.resourceRepository.findByCloudinaryPublicId(publicId);
        if (!resource) return;

        if (isConversionFailure(payload)) {
            await this.resourceRepository.updateStatus(resource.id, "FAILED");
            return;
        }

        if (!isConversionComplete(payload)) return;

        const pdfUrl = cloudinaryService.buildPdfUrl(publicId);
        await this.resourceRepository.updateFileUrl(resource.id, pdfUrl);
        await this.resourceRepository.updateStatus(resource.id, "PROCESSING");
        resource.fileUrl = pdfUrl;
        void this.ingestResourceAsync(resource.id, pdfUrl);
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

    async getCourses(instructorId?: string) {
        const response = instructorId
            ? await this.courseRepository.findByInstructor(instructorId)
            : await this.courseRepository.findAll();
        return response.map((course) => ({
            id: course.id,
            name: course.name,
            code: course.code,
            acadamicYear: course.acadamicYear,
            departmentId: course.departmentId,
            description: course.description,
            status: course.status,
            instructorId: course.instructorId,
            instructorNames: course.instructorNames,
        }));
    }

    async getCourseById(data: { id: string }) {
        const course = await this.courseRepository.findOne(data);
        if (!course) return null;
        const instructorNames = await this.courseRepository.findCourseInstructors(course.id);
        return {
            id: course.id,
            name: course.name,
            code: course.code,
            acadamicYear: course.acadamicYear,
            departmentId: course.departmentId,
            description: course.description,
            status: course.status,
            instructorId: course.instructorId,
            instructorNames: instructorNames.map((instructor) => instructor.name),
            instructors: instructorNames,
        };
    }

    async createCourse(data: {
        name: string;
        code: string;
        acadamicYear: number;
        instructorId: string;
        departmentId?: string | undefined;
        description?: string | undefined;
        status?: CourseStatus | undefined;
    }): Promise<Course | string> {
        const existing = await this.courseRepository.findOneByCode(data.code);
        if (existing) {
            return "Course Already Exists!";
        }

        const departmentId = data.departmentId ?? await this.getDefaultDepartmentId();
        const course = await this.courseRepository.create({
            name: data.name,
            code: data.code,
            acadamicYear: data.acadamicYear,
            instructorId: data.instructorId,
            departmentId,
            description: data.description,
            status: data.status,
        });
        await this.courseRepository.assignInstructor(course.id, data.instructorId);
        return course;
    }

    async updateCourse(data: {
        id: string;
        name?: string | undefined;
        code?: string | undefined;
        acadamicYear?: number | undefined;
        instructorId?: string | undefined;
        departmentId?: string | undefined;
        description?: string | undefined;
        status?: CourseStatus | undefined;
    }) {
        const course = await this.courseRepository.findOne({ id: data.id });
        if (!course) {
            return "Course Not Found!";
        }
        const updated = await this.courseRepository.update(data);
        if (data.instructorId) {
            await this.courseRepository.assignInstructor(data.id, data.instructorId);
        }
        return updated;
    }

    async assignInstructor(courseId: string, instructorId: string) {
        const course = await this.courseRepository.findOne({ id: courseId });
        if (!course) return "Course Not Found!";

        const user = await this.userRepository.findUserById(instructorId);
        if (!user || user.role !== "INSTRUCTOR") {
            return "Instructor not found or invalid role!";
        }

        await this.courseRepository.assignInstructor(courseId, instructorId);
        return true;
    }

    async unassignInstructor(courseId: string, instructorId: string) {
        const course = await this.courseRepository.findOne({ id: courseId });
        if (!course) return "Course Not Found!";
        await this.courseRepository.unassignInstructor(courseId, instructorId);
        return true;
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
            description: deleted.description,
            status: deleted.status,
        });
    }

    private async getDefaultDepartmentId(): Promise<string> {
        const department = await prisma.department.findUnique({ where: { code: "CS101" } });
        if (!department) {
            throw new Error("Default department CS101 not found. Run seed first.");
        }
        return department.id;
    }
}
