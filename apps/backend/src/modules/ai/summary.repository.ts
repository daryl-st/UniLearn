import prisma from "../../config/db.js";

export type SummaryRecord = {
    id: string;
    resourceId: string;
    content: string;
    createdAt: Date;
};

export class SummaryRepository {
    async create(data: {
        resourceId: string;
        studnetId: string;
        content: string;
    }): Promise<SummaryRecord> {
        const row = await prisma.summary.create({
            data: {
                resourceId: data.resourceId,
                studnetId: data.studnetId,
                content: data.content,
            },
        });
        return {
            id: row.id,
            resourceId: row.resourceId,
            content: row.content,
            createdAt: row.createdAt,
        };
    }

    async listByResourceAndStudent(resourceId: string, studnetId: string): Promise<SummaryRecord[]> {
        const rows = await prisma.summary.findMany({
            where: { resourceId, studnetId },
            orderBy: { createdAt: "desc" },
        });
        return rows.map((row) => ({
            id: row.id,
            resourceId: row.resourceId,
            content: row.content,
            createdAt: row.createdAt,
        }));
    }

    async countChunksForResource(resourceId: string): Promise<number> {
        return prisma.resourceChunk.count({
            where: { resourceId },
        });
    }
}
