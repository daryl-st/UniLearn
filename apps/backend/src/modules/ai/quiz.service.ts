import type { Difficulty } from "@prisma/client";
import type { Prisma } from "@prisma/client";

import prisma from "../../config/db.js";
import { ResourceRepository } from "../resource/resource.repository.js";
import {
    AiConfigError,
    proxyGenerateQuiz,
    type GenerateQuizResponseBody,
    type ProxyResult,
} from "./ai.service.js";
import {
    QuizRepository,
    type QuestionForTaking,
    type QuizAttemptRecord,
    type QuizAttemptResultItem,
    type QuizListItem,
    type QuizWithQuestions,
} from "./quiz.repository.js";

function normalizeMcqAnswer(answer: string): string {
    const trimmed = answer.trim().toUpperCase();
    const letter = trimmed.charAt(0);
    if (/^[A-D]$/.test(letter)) return letter;
    return trimmed;
}

function gradeAnswer(
    options: Prisma.JsonValue | null,
    correctAns: string,
    userAnswer: string,
): boolean {
    if (options !== null && typeof options === "object") {
        return normalizeMcqAnswer(userAnswer) === normalizeMcqAnswer(correctAns);
    }
    return userAnswer.trim().toLowerCase() === correctAns.trim().toLowerCase();
}

function toQuestionsForTaking(questions: QuizWithQuestions["questions"]): QuestionForTaking[] {
    return questions.map((q) => ({
        id: q.id,
        content: q.content,
        options: q.options,
    }));
}

export class QuizService {
    constructor(
        private quizRepository: QuizRepository,
        private resourceRepository: ResourceRepository,
    ) {}

    async ensureStudentProfile(userId: string): Promise<void> {
        const profile = await prisma.studentProfile.findUnique({
            where: { id: userId },
        });
        if (!profile) {
            throw new QuizServiceError("Student profile required.", 403);
        }
    }

    async ensureResourceReadyForAi(resourceId: string): Promise<void> {
        const resource = await this.resourceRepository.findOne({ id: resourceId });
        if (!resource || resource.isDeleted) {
            throw new QuizServiceError("Resource not found.", 404);
        }
        if (resource.status === "FAILED") {
            throw new QuizServiceError("AI indexing failed for this resource.", 400);
        }
        if (resource.status === "PROCESSING" || resource.status === "QUEUED") {
            throw new QuizServiceError("Resource is still being processed for AI indexing.", 400);
        }

        const chunkCount = await this.quizRepository.countChunksForResource(resourceId);
        if (chunkCount === 0) {
            throw new QuizServiceError(
                "Resource is not indexed yet (no vectorized chunks found)",
                400,
            );
        }
    }

    async generateAndPersist(
        studentId: string,
        resourceId: string,
        difficulty: Difficulty,
        titleOverride?: string,
        maxChunks?: number,
        questionCount?: number,
    ): Promise<{ quiz: QuizWithQuestions; questionsForTaking: QuestionForTaking[] }> {
        await this.ensureStudentProfile(studentId);
        await this.ensureResourceReadyForAi(resourceId);

        let result: ProxyResult;
        try {
            result = await proxyGenerateQuiz({
                resourceId,
                difficulty,
                ...(maxChunks !== undefined ? { maxChunks } : {}),
                ...(questionCount !== undefined ? { questionCount } : {}),
            });
        } catch (e) {
            if (e instanceof AiConfigError) {
                throw new QuizServiceError(e.message, 503);
            }
            throw new QuizServiceError("AI service unreachable", 502);
        }

        if (!result.ok) {
            const detail =
                typeof result.body === "object" &&
                result.body !== null &&
                "detail" in result.body
                    ? String((result.body as { detail: unknown }).detail)
                    : "AI quiz generation failed";
            throw new QuizServiceError(detail, result.status);
        }

        const body = result.body as GenerateQuizResponseBody;
        if (!body.title?.trim() || !body.questions?.length) {
            throw new QuizServiceError("AI returned an invalid quiz", 502);
        }

        const title = titleOverride?.trim() || body.title.trim();
        const quiz = await this.quizRepository.createQuizWithQuestions({
            title,
            difficulty,
            resourceId,
            studnetId: studentId,
            userId: studentId,
            questions: body.questions.map((q) => ({
                content: q.content.trim(),
                options: q.options as Prisma.InputJsonValue | null,
                correctAns: q.correctAns.trim(),
            })),
        });

        return {
            quiz,
            questionsForTaking: toQuestionsForTaking(quiz.questions),
        };
    }

    async listForStudent(studentId: string, resourceId: string): Promise<QuizListItem[]> {
        await this.ensureStudentProfile(studentId);
        const resource = await this.resourceRepository.findOne({ id: resourceId });
        if (!resource || resource.isDeleted) {
            throw new QuizServiceError("Resource not found.", 404);
        }
        return this.quizRepository.listByResourceAndStudent(resourceId, studentId);
    }

    async getQuizForTaking(
        studentId: string,
        quizId: string,
    ): Promise<{ quiz: Omit<QuizWithQuestions, "questions">; questions: QuestionForTaking[] }> {
        await this.ensureStudentProfile(studentId);
        const quiz = await this.quizRepository.findQuizForStudent(quizId, studentId);
        if (!quiz) {
            throw new QuizServiceError("Quiz not found.", 404);
        }
        const { questions, ...meta } = quiz;
        return {
            quiz: meta,
            questions: toQuestionsForTaking(questions),
        };
    }

    async submit(
        studentId: string,
        quizId: string,
        answers: Array<{ questionId: string; answer: string }>,
    ): Promise<QuizAttemptRecord> {
        await this.ensureStudentProfile(studentId);
        const quiz = await this.quizRepository.findQuizForStudent(quizId, studentId);
        if (!quiz) {
            throw new QuizServiceError("Quiz not found.", 404);
        }

        const answerMap = new Map(answers.map((a) => [a.questionId, a.answer]));
        const results: QuizAttemptResultItem[] = [];
        let correctCount = 0;

        for (const question of quiz.questions) {
            const userAnswer = answerMap.get(question.id) ?? "";
            const isCorrect = gradeAnswer(question.options, question.correctAns, userAnswer);
            if (isCorrect) correctCount += 1;
            results.push({
                questionId: question.id,
                content: question.content,
                userAnswer,
                correctAnswer: question.correctAns,
                isCorrect,
            });
        }

        const total = quiz.questions.length;
        const score = total > 0 ? Math.round((correctCount / total) * 100) : 0;

        const attempt = await this.quizRepository.createAttempt({
            quizId,
            studnetId: studentId,
            score,
            results,
        });

        const courseId = await this.quizRepository.getResourceCourseId(quiz.resourceId);
        if (courseId) {
            await this.quizRepository.updateProgressAverage(studentId, courseId);
        }

        return attempt;
    }

    async getAttempt(studentId: string, attemptId: string): Promise<QuizAttemptRecord> {
        await this.ensureStudentProfile(studentId);
        const attempt = await this.quizRepository.findAttemptForStudent(attemptId, studentId);
        if (!attempt) {
            throw new QuizServiceError("Quiz attempt not found.", 404);
        }
        return attempt;
    }
}

export class QuizServiceError extends Error {
    constructor(
        message: string,
        public statusCode: number,
    ) {
        super(message);
        this.name = "QuizServiceError";
    }
}
