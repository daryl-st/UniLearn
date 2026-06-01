import prisma from "../../config/db.js";
import { ResourceRepository } from "../resource/resource.repository.js";
import {
    AiConfigError,
    proxySummarize,
    type ProxyResult,
    type SummarizeResponseBody,
} from "./ai.service.js";
import { SummaryRepository, type SummaryRecord } from "./summary.repository.js";

export class SummaryService {
    constructor(
        private summaryRepository: SummaryRepository,
        private resourceRepository: ResourceRepository,
    ) {}

    async ensureStudentProfile(userId: string): Promise<void> {
        const profile = await prisma.studentProfile.findUnique({
            where: { id: userId },
        });
        if (!profile) {
            throw new SummaryServiceError("Student profile required.", 403);
        }
    }

    async ensureResourceReadyForAi(resourceId: string): Promise<void> {
        const resource = await this.resourceRepository.findOne({ id: resourceId });
        if (!resource || resource.isDeleted) {
            throw new SummaryServiceError("Resource not found.", 404);
        }

        const chunkCount = await this.summaryRepository.countChunksForResource(resourceId);
        if (chunkCount === 0) {
            throw new SummaryServiceError(
                "Resource is not indexed yet (no vectorized chunks found)",
                400,
            );
        }
    }

    async generateAndPersist(
        studentId: string,
        resourceId: string,
        maxChunks?: number,
    ): Promise<SummaryRecord> {
        await this.ensureStudentProfile(studentId);
        await this.ensureResourceReadyForAi(resourceId);

        let result: ProxyResult;
        try {
            result = await proxySummarize(resourceId, maxChunks);
        } catch (e) {
            if (e instanceof AiConfigError) {
                throw new SummaryServiceError(e.message, 503);
            }
            throw new SummaryServiceError("AI service unreachable", 502);
        }

        if (!result.ok) {
            const detail =
                typeof result.body === "object" &&
                result.body !== null &&
                "detail" in result.body
                    ? String((result.body as { detail: unknown }).detail)
                    : "AI summarize failed";
            throw new SummaryServiceError(detail, result.status);
        }

        const body = result.body as SummarizeResponseBody;
        if (!body.summary?.trim()) {
            throw new SummaryServiceError("AI returned an empty summary", 502);
        }

        return this.summaryRepository.create({
            resourceId,
            studnetId: studentId,
            content: body.summary.trim(),
        });
    }

    async listForStudent(studentId: string, resourceId: string) {
        await this.ensureStudentProfile(studentId);
        const resource = await this.resourceRepository.findOne({ id: resourceId });
        if (!resource || resource.isDeleted) {
            throw new SummaryServiceError("Resource not found.", 404);
        }
        return this.summaryRepository.listByResourceAndStudent(resourceId, studentId);
    }
}

export class SummaryServiceError extends Error {
    constructor(
        message: string,
        public statusCode: number,
    ) {
        super(message);
        this.name = "SummaryServiceError";
    }
}
