import type { FileType, IngestStatus } from "@unilearn/shared-types";
import type { CourseRepository, ResourceRepository } from "./resource.repository.js";
import { Course, Resource } from "./resource.entity.js";
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

export type UploadResourceResult = UploadResourceSuccess | UploadResourceConflict;

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
        // Viewable immediately for native PDFs; Office files stay PROCESSING until conversion webhook.
        const initialStatus = data.needsConversion ? "PROCESSING" : "READY";

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
        try {
            const ingest = await proxyIngestResource(resourceId, pdfUrl);
            if (!ingest.ok) {
                // Keep READY so uploads remain viewable when AI indexing is unavailable.
                await this.resourceRepository.updateStatus(resourceId, "READY");
                return "failed";
            }

            const body = ingest.body as IngestResponseBody;
            await this.resourceRepository.upsertChunks(resourceId, body.chunks ?? []);
            await this.resourceRepository.updateStatus(resourceId, "READY");
            return "ready";
        } catch {
            await this.resourceRepository.updateStatus(resourceId, "READY");
            return "failed";
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
        await this.resourceRepository.updateStatus(resource.id, "READY");
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

    async getCourses(instructorId?: string): Promise<
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
        const response = instructorId
            ? await this.courseRepository.findByInstructor(instructorId)
            : await this.courseRepository.findAll();
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
        const course = await this.courseRepository.findOne(data);
        if (!course) return null;
        const instructorName = await this.userRepository.getUserNameById(course.instructorId);
        return {
            id: course.id,
            name: course.name,
            code: course.code,
            acadamicYear: course.acadamicYear,
            instructorId: course.instructorId,
            departmentId: course.departmentId,
            instructorName: instructorName ?? "",
        };
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
