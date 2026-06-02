import type { Request, Response } from "express";
import { z } from "zod";

import type { AuthRequest } from "../../middlewares/auth.js";
import {
    type askResourceBody,
    type generateQuizBody,
    type ingestResourceBody,
    type listQuizzesQuery,
    listQuizzesQuerySchema,
    type listChatQuery,
    listChatQuerySchema,
    type listSummariesQuery,
    listSummariesQuerySchema,
    type submitQuizBody,
    type summarizeResourceBody,
} from "../../schemas/index.js";
import {
    AiConfigError,
    proxyExtractFile,
    proxyExtractUrl,
} from "./ai.service.js";
import { ChatRepository } from "./chat.repository.js";
import { ChatService, ChatServiceError, type ClientChatMessageRecord } from "./chat.service.js";
import { ResourceRepository } from "../resource/resource.repository.js";
import { ResourceService } from "../resource/resource.service.js";
import { QuizRepository } from "./quiz.repository.js";
import { QuizService, QuizServiceError } from "./quiz.service.js";
import { SummaryRepository, type SummaryRecord } from "./summary.repository.js";
import { SummaryService, SummaryServiceError } from "./summary.service.js";

const summaryRepository = new SummaryRepository();
const chatRepository = new ChatRepository();
const quizRepository = new QuizRepository();
const resourceRepository = new ResourceRepository();
const resourceService = new ResourceService(resourceRepository);
const summaryService = new SummaryService(summaryRepository, resourceRepository);
const chatService = new ChatService(chatRepository, resourceRepository);
const quizService = new QuizService(quizRepository, resourceRepository);

function routeParam(value: string | string[] | undefined): string | null {
    if (typeof value === "string" && value.length > 0) return value;
    if (Array.isArray(value) && typeof value[0] === "string") return value[0];
    return null;
}

function toChatMessageJson(record: ClientChatMessageRecord) {
    return {
        id: record.id,
        role: record.role,
        content: record.content,
        ...(record.citations ? { citations: record.citations } : {}),
        createdAt: record.createdAt.toISOString(),
    };
}

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
            const result = await resourceService.reindexResource({
                resourceId: body.resourceId,
                fileUrl: body.fileUrl,
            });
            if (!result.ok) {
                res.status(result.statusCode).json({ error: result.message });
                return;
            }
            res.status(200).json({
                resourceId: body.resourceId,
                status: result.status,
                ingestStatus: result.ingestStatus,
                chunkCount: result.chunkCount,
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

    getChat = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                res.status(401).json({ error: "Unauthorized" });
                return;
            }
            const parsed = listChatQuerySchema.safeParse(req.query);
            if (!parsed.success) {
                res.status(400).json({
                    error: "Invalid query",
                    details: parsed.error.flatten(),
                });
                return;
            }
            const query = parsed.data as listChatQuery;
            const messages = await chatService.listMessages(userId, query.resourceId);
            res.status(200).json({
                messages: messages.map(toChatMessageJson),
            });
        } catch (e) {
            if (e instanceof ChatServiceError) {
                res.status(e.statusCode).json({ error: e.message });
                return;
            }
            res.status(500).json({ error: "Failed to load chat" });
        }
    };

    generateQuiz = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                res.status(401).json({ error: "Unauthorized" });
                return;
            }
            const body = req.body as generateQuizBody;
            const { quiz, questionsForTaking } = await quizService.generateAndPersist(
                userId,
                body.resourceId,
                body.difficulty,
                body.title,
                body.maxChunks,
                body.questionCount,
            );
            res.status(201).json({
                quiz: {
                    id: quiz.id,
                    title: quiz.title,
                    difficulty: quiz.difficulty,
                    resourceId: quiz.resourceId,
                    createdAt: quiz.createdAt.toISOString(),
                },
                questions: questionsForTaking,
            });
        } catch (e) {
            if (e instanceof QuizServiceError) {
                res.status(e.statusCode).json({ error: e.message });
                return;
            }
            res.status(500).json({ error: "Failed to generate quiz" });
        }
    };

    listQuizzes = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                res.status(401).json({ error: "Unauthorized" });
                return;
            }
            const parsed = listQuizzesQuerySchema.safeParse(req.query);
            if (!parsed.success) {
                res.status(400).json({
                    error: "Invalid query",
                    details: parsed.error.flatten(),
                });
                return;
            }
            const query = parsed.data as listQuizzesQuery;
            const quizzes = await quizService.listForStudent(userId, query.resourceId);
            res.status(200).json({
                quizzes: quizzes.map((q) => ({
                    id: q.id,
                    title: q.title,
                    difficulty: q.difficulty,
                    resourceId: q.resourceId,
                    createdAt: q.createdAt.toISOString(),
                    attemptCount: q.attemptCount,
                })),
            });
        } catch (e) {
            if (e instanceof QuizServiceError) {
                res.status(e.statusCode).json({ error: e.message });
                return;
            }
            res.status(500).json({ error: "Failed to list quizzes" });
        }
    };

    getQuiz = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                res.status(401).json({ error: "Unauthorized" });
                return;
            }
            const quizId = routeParam(req.params.quizId);
            if (!quizId) {
                res.status(400).json({ error: "Quiz id required" });
                return;
            }
            const { quiz, questions } = await quizService.getQuizForTaking(userId, quizId);
            res.status(200).json({
                quiz: {
                    id: quiz.id,
                    title: quiz.title,
                    difficulty: quiz.difficulty,
                    resourceId: quiz.resourceId,
                    createdAt: quiz.createdAt.toISOString(),
                },
                questions,
            });
        } catch (e) {
            if (e instanceof QuizServiceError) {
                res.status(e.statusCode).json({ error: e.message });
                return;
            }
            res.status(500).json({ error: "Failed to load quiz" });
        }
    };

    submitQuiz = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                res.status(401).json({ error: "Unauthorized" });
                return;
            }
            const quizId = routeParam(req.params.quizId);
            if (!quizId) {
                res.status(400).json({ error: "Quiz id required" });
                return;
            }
            const body = req.body as submitQuizBody;
            const attempt = await quizService.submit(userId, quizId, body.answers);
            res.status(201).json({
                attempt: {
                    id: attempt.id,
                    score: attempt.score,
                    quizId: attempt.quizId,
                    createdAt: attempt.createdAt.toISOString(),
                    results: attempt.results,
                },
            });
        } catch (e) {
            if (e instanceof QuizServiceError) {
                res.status(e.statusCode).json({ error: e.message });
                return;
            }
            res.status(500).json({ error: "Failed to submit quiz" });
        }
    };

    getQuizAttempt = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                res.status(401).json({ error: "Unauthorized" });
                return;
            }
            const attemptId = routeParam(req.params.attemptId);
            if (!attemptId) {
                res.status(400).json({ error: "Attempt id required" });
                return;
            }
            const attempt = await quizService.getAttempt(userId, attemptId);
            res.status(200).json({
                attempt: {
                    id: attempt.id,
                    score: attempt.score,
                    quizId: attempt.quizId,
                    createdAt: attempt.createdAt.toISOString(),
                    results: attempt.results,
                },
            });
        } catch (e) {
            if (e instanceof QuizServiceError) {
                res.status(e.statusCode).json({ error: e.message });
                return;
            }
            res.status(500).json({ error: "Failed to load quiz attempt" });
        }
    };

    askResource = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                res.status(401).json({ error: "Unauthorized" });
                return;
            }
            const body = req.body as askResourceBody;
            const result = await chatService.askAndPersist(
                userId,
                body.resourceId,
                body.question,
                body.topK,
            );
            res.status(200).json({
                resourceId: result.resourceId,
                answer: result.answer,
                citations: result.citations,
                usedChunks: result.usedChunks,
                messages: result.messages.map(toChatMessageJson),
            });
        } catch (e) {
            if (e instanceof ChatServiceError) {
                res.status(e.statusCode).json({ error: e.message });
                return;
            }
            res.status(500).json({ error: "Failed to process question" });
        }
    };
}
