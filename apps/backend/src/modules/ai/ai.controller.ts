import type { Request, Response } from "express";
import { z } from "zod";

import type { AuthRequest } from "../../middlewares/auth.js";
import type { askResourceBody, ingestResourceBody } from "../../schemas/index.js";
import { ResourceRepository } from "../resource/resource.repository.js";
import {
    AiConfigError,
    type AskAnswerResponseBody,
    type AskContextChunk,
    type AskEmbedResponseBody,
    proxyAskAnswer,
    proxyAskEmbed,
    proxyExtractFile,
    proxyExtractUrl,
    proxyIngestResource,
} from "./ai.service.js";

const extractUrlBodySchema = z.object({
    url: z.string().url().max(2048),
});
const resourceRepository = new ResourceRepository();

function cosineSimilarity(a: number[], b: number[]): number {
    if (a.length === 0 || b.length === 0 || a.length !== b.length) return 0;
    let dot = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < a.length; i += 1) {
        const av = a[i] ?? 0;
        const bv = b[i] ?? 0;
        dot += av * bv;
        normA += av * av;
        normB += bv * bv;
    }
    if (normA === 0 || normB === 0) return 0;
    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

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

    askResource = async (req: Request, res: Response): Promise<void> => {
        try {
            const body = req.body as askResourceBody;
            const topK = body.topK ?? 5;

            const chunks = await resourceRepository.findChunksWithEmbeddings(body.resourceId);
            if (!chunks.length) {
                res.status(400).json({
                    error: "Resource is not indexed yet (no chunk embeddings found)",
                });
                return;
            }

            const embedResult = await proxyAskEmbed(body.question);
            if (!embedResult.ok) {
                res.status(embedResult.status).json(embedResult.body);
                return;
            }
            const embedBody = embedResult.body as AskEmbedResponseBody;
            const queryEmbedding = embedBody.embedding;
            if (!Array.isArray(queryEmbedding) || queryEmbedding.length === 0) {
                res.status(502).json({ error: "Invalid embedding response from AI service" });
                return;
            }

            const ranked = chunks
                .map((chunk) => ({
                    ...chunk,
                    score: cosineSimilarity(queryEmbedding, chunk.embedding),
                }))
                .sort((a, b) => b.score - a.score)
                .slice(0, topK);

            const contextChunks: AskContextChunk[] = ranked.map((r) => ({
                chunkIndex: r.chunkIndex,
                pageNumber: r.pageNumber,
                content: r.content,
                score: r.score,
            }));

            const answerResult = await proxyAskAnswer(body.question, contextChunks);
            if (!answerResult.ok) {
                res.status(answerResult.status).json(answerResult.body);
                return;
            }
            const answerBody = answerResult.body as AskAnswerResponseBody;
            res.status(200).json({
                resourceId: body.resourceId,
                answer: answerBody.answer,
                citations: answerBody.citations,
                usedChunks: contextChunks.length,
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
