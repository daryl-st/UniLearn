import type { Difficulty, Prisma } from "@prisma/client";

import prisma from "../../config/db.js";

export type QuizListItem = {
    id: string;
    title: string;
    difficulty: Difficulty;
    resourceId: string;
    createdAt: Date;
    attemptCount: number;
};

export type QuestionRecord = {
    id: string;
    content: string;
    options: Prisma.JsonValue | null;
    correctAns: string;
    quizId: string;
};

export type QuizWithQuestions = {
    id: string;
    title: string;
    difficulty: Difficulty;
    resourceId: string;
    studnetId: string;
    createdAt: Date;
    questions: QuestionRecord[];
};

export type QuestionForTaking = {
    id: string;
    content: string;
    options: Prisma.JsonValue | null;
};

export type QuizAttemptResultItem = {
    questionId: string;
    content: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
};

export type QuizAttemptRecord = {
    id: string;
    score: number;
    quizId: string;
    studnetId: string;
    results: QuizAttemptResultItem[] | null;
    createdAt: Date;
};

export class QuizRepository {
    async countChunksForResource(resourceId: string): Promise<number> {
        return prisma.resourceChunk.count({
            where: { resourceId },
        });
    }

    async createQuizWithQuestions(data: {
        title: string;
        difficulty: Difficulty;
        resourceId: string;
        studnetId: string;
        userId: string;
        questions: Array<{
            content: string;
            options: Prisma.InputJsonValue | null;
            correctAns: string;
        }>;
    }): Promise<QuizWithQuestions> {
        const quiz = await prisma.quiz.create({
            data: {
                title: data.title,
                difficulty: data.difficulty,
                resourceId: data.resourceId,
                studnetId: data.studnetId,
                userId: data.userId,
                questions: {
                    create: data.questions.map((q) => {
                        const row = {
                            content: q.content,
                            correctAns: q.correctAns,
                        };
                        if (q.options != null) {
                            return { ...row, options: q.options };
                        }
                        return row;
                    }),
                },
            },
            include: { questions: { orderBy: { createdAt: "asc" } } },
        });
        const loaded = await prisma.quiz.findUniqueOrThrow({
            where: { id: quiz.id },
            include: { questions: { orderBy: { createdAt: "asc" } } },
        });
        return {
            id: loaded.id,
            title: loaded.title,
            difficulty: loaded.difficulty,
            resourceId: loaded.resourceId,
            studnetId: loaded.studnetId,
            createdAt: loaded.createdAt,
            questions: loaded.questions.map((q) => ({
                id: q.id,
                content: q.content,
                options: q.options,
                correctAns: q.correctAns,
                quizId: q.quizId,
            })),
        };
    }

    async listByResourceAndStudent(resourceId: string, studnetId: string): Promise<QuizListItem[]> {
        const rows = await prisma.quiz.findMany({
            where: { resourceId, studnetId },
            orderBy: { createdAt: "desc" },
            include: {
                _count: { select: { attempts: true } },
            },
        });
        return rows.map((row) => ({
            id: row.id,
            title: row.title,
            difficulty: row.difficulty,
            resourceId: row.resourceId,
            createdAt: row.createdAt,
            attemptCount: row._count.attempts,
        }));
    }

    async findQuizForStudent(quizId: string, studnetId: string): Promise<QuizWithQuestions | null> {
        const quiz = await prisma.quiz.findFirst({
            where: { id: quizId, studnetId },
            include: { questions: { orderBy: { createdAt: "asc" } } },
        });
        if (!quiz) return null;
        return {
            id: quiz.id,
            title: quiz.title,
            difficulty: quiz.difficulty,
            resourceId: quiz.resourceId,
            studnetId: quiz.studnetId,
            createdAt: quiz.createdAt,
            questions: quiz.questions.map((q) => ({
                id: q.id,
                content: q.content,
                options: q.options,
                correctAns: q.correctAns,
                quizId: q.quizId,
            })),
        };
    }

    async getResourceCourseId(resourceId: string): Promise<string | null> {
        const resource = await prisma.resource.findUnique({
            where: { id: resourceId },
            select: { courseId: true },
        });
        return resource?.courseId ?? null;
    }

    async createAttempt(data: {
        quizId: string;
        studnetId: string;
        score: number;
        results: QuizAttemptResultItem[];
    }): Promise<QuizAttemptRecord> {
        const row = await prisma.quizAttempt.create({
            data: {
                quizId: data.quizId,
                studnetId: data.studnetId,
                score: data.score,
                results: data.results as unknown as Prisma.InputJsonValue,
            },
        });
        return {
            id: row.id,
            score: row.score,
            quizId: row.quizId,
            studnetId: row.studnetId,
            results: data.results,
            createdAt: row.createdAt,
        };
    }

    async findAttemptForStudent(
        attemptId: string,
        studnetId: string,
    ): Promise<QuizAttemptRecord | null> {
        const row = await prisma.quizAttempt.findFirst({
            where: { id: attemptId, studnetId },
        });
        if (!row) return null;
        return {
            id: row.id,
            score: row.score,
            quizId: row.quizId,
            studnetId: row.studnetId,
            results: (row.results as QuizAttemptResultItem[] | null) ?? null,
            createdAt: row.createdAt,
        };
    }

    async updateProgressAverage(studnetId: string, courseId: string): Promise<void> {
        const avgResult = await prisma.quizAttempt.aggregate({
            where: {
                studnetId,
                quiz: { resource: { courseId } },
            },
            _avg: { score: true },
        });
        const averageScore = avgResult._avg.score ?? 0;
        await prisma.progress.upsert({
            where: {
                studnetId_courseId: { studnetId, courseId },
            },
            update: { averageScore },
            create: {
                studnetId,
                courseId,
                resourceViewed: 0,
                averageScore,
            },
        });
    }
}
