import type { ChatMessageRole, Prisma } from "@prisma/client";

import prisma from "../../config/db.js";

export type ChatMessageRecord = {
    id: string;
    threadId: string;
    role: ChatMessageRole;
    content: string;
    citations: unknown;
    createdAt: Date;
};

export type ChatThreadRecord = {
    id: string;
    resourceId: string;
    studnetId: string;
    createdAt: Date;
    updatedAt: Date;
};

export class ChatRepository {
    async findOrCreateThread(resourceId: string, studnetId: string): Promise<ChatThreadRecord> {
        const existing = await prisma.chatThread.findUnique({
            where: {
                resourceId_studnetId: { resourceId, studnetId },
            },
        });
        if (existing) {
            return existing;
        }

        return prisma.chatThread.create({
            data: { resourceId, studnetId },
        });
    }

    async listMessages(threadId: string): Promise<ChatMessageRecord[]> {
        return prisma.chatMessage.findMany({
            where: { threadId },
            orderBy: { createdAt: "asc" },
        });
    }

    async appendMessage(data: {
        threadId: string;
        role: ChatMessageRole;
        content: string;
        citations?: unknown;
    }): Promise<ChatMessageRecord> {
        const createData: Prisma.ChatMessageUncheckedCreateInput = {
            threadId: data.threadId,
            role: data.role,
            content: data.content,
        };
        if (data.citations !== undefined) {
            createData.citations = data.citations as Prisma.InputJsonValue;
        }

        const message = await prisma.chatMessage.create({
            data: createData,
        });

        await prisma.chatThread.update({
            where: { id: data.threadId },
            data: { updatedAt: new Date() },
        });

        return message;
    }

    async countChunksForResource(resourceId: string): Promise<number> {
        return prisma.resourceChunk.count({
            where: { resourceId },
        });
    }
}
