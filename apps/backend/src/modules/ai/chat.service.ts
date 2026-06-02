import prisma from "../../config/db.js";
import { ResourceRepository } from "../resource/resource.repository.js";
import {
    AiConfigError,
    proxyRagAsk,
    type ProxyResult,
    type RagAskResponseBody,
} from "./ai.service.js";
import { ChatRepository, type ChatMessageRecord } from "./chat.repository.js";

export type ClientChatMessageRecord = {
    id: string;
    role: "user" | "assistant";
    content: string;
    citations?: Array<{ chunkIndex: number; pageNumber: number; score: number }>;
    createdAt: Date;
};

export type AskAndPersistResult = {
    resourceId: string;
    answer: string;
    citations: Array<{ chunkIndex: number; pageNumber: number; score: number }>;
    usedChunks: number;
    messages: ClientChatMessageRecord[];
};

export class ChatService {
    constructor(
        private chatRepository: ChatRepository,
        private resourceRepository: ResourceRepository,
    ) {}

    async ensureStudentProfile(userId: string): Promise<void> {
        const profile = await prisma.studentProfile.findUnique({
            where: { id: userId },
        });
        if (!profile) {
            throw ChatServiceError.studentRequired();
        }
    }

    async ensureResourceReadyForAi(resourceId: string): Promise<void> {
        const resource = await this.resourceRepository.findOne({ id: resourceId });
        if (!resource || resource.isDeleted) {
            throw new ChatServiceError("Resource not found.", 404);
        }
        if (resource.status === "FAILED") {
            throw new ChatServiceError("AI indexing failed for this resource.", 400);
        }
        if (resource.status === "PROCESSING" || resource.status === "QUEUED") {
            throw new ChatServiceError("Resource is still being processed for AI indexing.", 400);
        }

        const chunkCount = await this.chatRepository.countChunksForResource(resourceId);
        if (chunkCount === 0) {
            throw new ChatServiceError(
                "Resource is not indexed yet (no vectorized chunks found)",
                400,
            );
        }
    }

    async listMessages(studentId: string, resourceId: string): Promise<ClientChatMessageRecord[]> {
        await this.ensureStudentProfile(studentId);
        await this.ensureResourceExists(resourceId);

        const thread = await this.chatRepository.findOrCreateThread(resourceId, studentId);
        const rows = await this.chatRepository.listMessages(thread.id);
        return rows.map(toClientMessage);
    }

    async askAndPersist(
        studentId: string,
        resourceId: string,
        question: string,
        topK?: number,
    ): Promise<AskAndPersistResult> {
        await this.ensureStudentProfile(studentId);
        await this.ensureResourceReadyForAi(resourceId);

        const thread = await this.chatRepository.findOrCreateThread(resourceId, studentId);

        let result: ProxyResult;
        try {
            result = await proxyRagAsk(resourceId, question, topK);
        } catch (e) {
            if (e instanceof AiConfigError) {
                throw new ChatServiceError(e.message, 503);
            }
            throw new ChatServiceError("AI service unreachable", 502);
        }

        if (!result.ok) {
            const detail =
                typeof result.body === "object" &&
                result.body !== null &&
                "detail" in result.body
                    ? String((result.body as { detail: unknown }).detail)
                    : "AI ask failed";
            throw new ChatServiceError(detail, result.status);
        }

        const body = result.body as RagAskResponseBody;
        const answer = body.answer?.trim() ?? "";
        if (!answer) {
            throw new ChatServiceError("AI returned an empty answer", 502);
        }

        await this.chatRepository.appendMessage({
            threadId: thread.id,
            role: "USER",
            content: question.trim(),
        });

        await this.chatRepository.appendMessage({
            threadId: thread.id,
            role: "ASSISTANT",
            content: answer,
            citations: body.citations ?? [],
        });

        const rows = await this.chatRepository.listMessages(thread.id);

        return {
            resourceId: body.resourceId,
            answer,
            citations: body.citations ?? [],
            usedChunks: body.usedChunks ?? 0,
            messages: rows.map(toClientMessage),
        };
    }

    private async ensureResourceExists(resourceId: string): Promise<void> {
        const resource = await this.resourceRepository.findOne({ id: resourceId });
        if (!resource || resource.isDeleted) {
            throw new ChatServiceError("Resource not found.", 404);
        }
    }
}

function toClientMessage(row: ChatMessageRecord): ClientChatMessageRecord {
    const citations = parseCitations(row.citations);
    return {
        id: row.id,
        role: row.role === "USER" ? "user" : "assistant",
        content: row.content,
        ...(citations.length > 0 ? { citations } : {}),
        createdAt: row.createdAt,
    };
}

function parseCitations(
    value: unknown,
): Array<{ chunkIndex: number; pageNumber: number; score: number }> {
    if (!Array.isArray(value)) return [];
    const out: Array<{ chunkIndex: number; pageNumber: number; score: number }> = [];
    for (const item of value) {
        if (!item || typeof item !== "object") continue;
        const o = item as Record<string, unknown>;
        if (
            typeof o.chunkIndex === "number" &&
            typeof o.pageNumber === "number" &&
            typeof o.score === "number"
        ) {
            out.push({
                chunkIndex: o.chunkIndex,
                pageNumber: o.pageNumber,
                score: o.score,
            });
        }
    }
    return out;
}

export class ChatServiceError extends Error {
    constructor(
        message: string,
        public statusCode: number,
    ) {
        super(message);
        this.name = "ChatServiceError";
    }

    static studentRequired(): ChatServiceError {
        return new ChatServiceError("Student profile required.", 403);
    }
}
