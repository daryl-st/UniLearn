import type { Request, Response } from "express";
import { z } from "zod";

import type { AuthRequest } from "../../middlewares/auth.js";
import {
    type askResourceBody,
    type ingestResourceBody,
    type listSummariesQuery,
    listSummariesQuerySchema,
    type summarizeResourceBody,
} from "../../schemas/index.js";
import {
    AiConfigError,
    type RagAskResponseBody,
    proxyExtractFile,
    proxyExtractUrl,
    proxyIngestResource,
    proxyRagAsk,
} from "./ai.service.js";
import { ResourceRepository } from "../resource/resource.repository.js";
import { SummaryRepository, type SummaryRecord } from "./summary.repository.js";
import { SummaryService, SummaryServiceError } from "./summary.service.js";

const summaryRepository = new SummaryRepository();
const resourceRepository = new ResourceRepository();
const summaryService = new SummaryService(summaryRepository, resourceRepository);

function toSummaryJson(record: SummaryRecord) {
    return {
        id: record.id,
        resourceId: record.resourceId,
        content: record.content,
        createdAt: record.createdAt.toISOString(),
    };
}

const extractUrlBodySchema = z.object({
    url: z.string().url().max(2048),
});

export class AiController {
    extractFile = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const file = req.file;
            if (!file?.buffer?.length) {
                res.status(400).json({
                    error: "Missing PDF file (multipart field name: file)",
                });
                return;
            }

            const result = await proxyExtractFile(file.buffer, file.originalname || "upload.pdf");
            if (!result.ok) {
                res.status(result.status).json(result.body);
                return;
            }
            res.status(200).json(result.body);
        } catch (e) {
            if (e instanceof AiConfigError) {
                res.status(503).json({ error: e.message });
                return;
            }
            res.status(502).json({
                error: "AI service unreachable",
                detail: e instanceof Error ? e.message : String(e),
            });
        }
    };

    extractUrl = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const parsed = extractUrlBodySchema.safeParse(req.body);
            if (!parsed.success) {
                res.status(400).json({
                    error: "Invalid body",
                    issues: parsed.error.flatten(),
                });
                return;
            }

            const result = await proxyExtractUrl(parsed.data.url);
            if (!result.ok) {
                res.status(result.status).json(result.body);
                return;
            }
            res.status(200).json(result.body);
        } catch (e) {
            if (e instanceof AiConfigError) {
                res.status(503).json({ error: e.message });
                return;
            }
            res.status(502).json({
                error: "AI service unreachable",
                detail: e instanceof Error ? e.message : String(e),
            });
        }
    };

    ingestResource = async (req: Request, res: Response): Promise<void> => {
        try {
            const body = req.body as ingestResourceBody;
            const result = await proxyIngestResource(body.resourceId, body.fileUrl);
            if (!result.ok) {
                res.status(result.status).json(result.body);
                return;
            }
            res.status(200).json(result.body);
        } catch (e) {
            if (e instanceof AiConfigError) {
                res.status(503).json({ error: e.message });
                return;
            }
            res.status(502).json({
                error: "AI service unreachable",
                detail: e instanceof Error ? e.message : String(e),
            });
        }
    };

    summarizeResource = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                res.status(401).json({ error: "Unauthorized" });
                return;
            }
            const body = req.body as summarizeResourceBody;
            const record = await summaryService.generateAndPersist(
                userId,
                body.resourceId,
                body.maxChunks,
            );
            res.status(201).json({ summary: toSummaryJson(record) });
        } catch (e) {
            if (e instanceof SummaryServiceError) {
                res.status(e.statusCode).json({ error: e.message });
                return;
            }
            res.status(500).json({ error: "Failed to generate summary" });
        }
    };

    listSummaries = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                res.status(401).json({ error: "Unauthorized" });
                return;
            }
            const parsed = listSummariesQuerySchema.safeParse(req.query);
            if (!parsed.success) {
                res.status(400).json({
                    error: "Invalid query",
                    details: parsed.error.flatten(),
                });
                return;
            }
            const query = parsed.data as listSummariesQuery;
            const records = await summaryService.listForStudent(userId, query.resourceId);
            res.status(200).json({
                summaries: records.map(toSummaryJson),
            });
        } catch (e) {
            if (e instanceof SummaryServiceError) {
                res.status(e.statusCode).json({ error: e.message });
                return;
            }
            res.status(500).json({ error: "Failed to list summaries" });
        }
    };

    askResource = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const body = req.body as askResourceBody;
            const result = await proxyRagAsk(body.resourceId, body.question, body.topK);
            if (!result.ok) {
                res.status(result.status).json(result.body);
                return;
            }
            const answerBody = result.body as RagAskResponseBody;
            res.status(200).json({
                resourceId: answerBody.resourceId,
                answer: answerBody.answer,
                citations: answerBody.citations,
                usedChunks: answerBody.usedChunks,
            });
        } catch (e) {
            if (e instanceof AiConfigError) {
                res.status(503).json({ error: e.message });
                return;
            }
            res.status(502).json({
                error: "AI service unreachable",
                detail: e instanceof Error ? e.message : String(e),
            });
        }
    };
}
