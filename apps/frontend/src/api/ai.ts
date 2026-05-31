import type {
    CreateSummaryResponse,
    Difficulty,
    GenerateQuizResponse,
    GetQuizAttemptResponse,
    GetQuizResponse,
    ListQuizzesResponse,
    ListSummariesResponse,
    SubmitQuizResponse,
    SummaryRecord,
} from '@unilearn/shared-types';
import { api, ApiError } from './client';

export type { SummaryRecord };

export type AskResourceResponse = {
    resourceId: string;
    answer: string;
    citations: Array<{ chunkIndex: number; pageNumber: number; score: number }>;
    usedChunks: number;
};

function messageFromApiData(data: unknown): string | null {
    if (data == null) return null;
    if (typeof data === 'string') return data;
    if (typeof data !== 'object') return null;

    const obj = data as Record<string, unknown>;

    if (typeof obj.error === 'string') return obj.error;
    if (typeof obj.message === 'string') return obj.message;

    const detail = obj.detail;
    if (typeof detail === 'string') return detail;
    if (Array.isArray(detail)) {
        const parts = detail
            .map((item) => {
                if (typeof item === 'string') return item;
                if (item && typeof item === 'object' && 'msg' in item) {
                    return String((item as { msg: unknown }).msg);
                }
                return null;
            })
            .filter(Boolean);
        if (parts.length > 0) return parts.join(' ');
    }

    return null;
}

export function aiResourceErrorMessage(err: unknown): string {
    if (err instanceof ApiError) {
        const fromBody = messageFromApiData(err.data);
        const lower = (fromBody ?? '').toLowerCase();

        if (
            err.status === 400 &&
            (lower.includes('not indexed') ||
                lower.includes('no vectorized chunks') ||
                lower.includes('no chunks found'))
        ) {
            return 'This material is still being processed. Try again after upload finishes.';
        }
        if (err.status === 408) {
            return 'Request timed out — try again with a shorter request.';
        }
        if (err.status === 502 || err.status === 503) {
            return 'AI service is unavailable right now. Please try again later.';
        }
        if (fromBody) return fromBody;
        return err.message || 'Something went wrong. Please try again.';
    }
    if (err instanceof Error) return err.message;
    return 'Something went wrong. Please try again.';
}

/** @deprecated Use aiResourceErrorMessage */
export const askResourceErrorMessage = aiResourceErrorMessage;

export const AiAPI = {
    askResource: async (body: { resourceId: string; question: string; topK?: number }) => {
        try {
            return await api.post<AskResourceResponse>('ai/ask', body, { timeout: 120_000 });
        } catch (err) {
            if (err instanceof ApiError) throw err;
            throw new Error('AI request failed');
        }
    },

    generateSummary: async (body: { resourceId: string; maxChunks?: number }) => {
        try {
            return await api.post<CreateSummaryResponse>('ai/summarize', body, { timeout: 120_000 });
        } catch (err) {
            if (err instanceof ApiError) throw err;
            throw new Error('Summary generation failed');
        }
    },

    listSummaries: async (resourceId: string) => {
        try {
            return await api.get<ListSummariesResponse>('ai/summaries', {
                params: { resourceId },
            });
        } catch (err) {
            if (err instanceof ApiError) throw err;
            throw new Error('Failed to load summaries');
        }
    },

    generateQuiz: async (body: {
        resourceId: string;
        difficulty: Difficulty;
        title?: string;
        maxChunks?: number;
        questionCount?: number;
    }) => {
        try {
            return await api.post<GenerateQuizResponse>('ai/generate-quiz', body, {
                timeout: 120_000,
            });
        } catch (err) {
            if (err instanceof ApiError) throw err;
            throw new Error('Quiz generation failed');
        }
    },

    listQuizzes: async (resourceId: string) => {
        try {
            return await api.get<ListQuizzesResponse>('ai/quizzes', {
                params: { resourceId },
            });
        } catch (err) {
            if (err instanceof ApiError) throw err;
            throw new Error('Failed to load quizzes');
        }
    },

    getQuiz: async (quizId: string) => {
        try {
            return await api.get<GetQuizResponse>(`ai/quizzes/${quizId}`);
        } catch (err) {
            if (err instanceof ApiError) throw err;
            throw new Error('Failed to load quiz');
        }
    },

    submitQuiz: async (quizId: string, answers: Array<{ questionId: string; answer: string }>) => {
        try {
            return await api.post<SubmitQuizResponse>(`ai/quizzes/${quizId}/submit`, {
                answers,
            });
        } catch (err) {
            if (err instanceof ApiError) throw err;
            throw new Error('Failed to submit quiz');
        }
    },

    getQuizAttempt: async (attemptId: string) => {
        try {
            return await api.get<GetQuizAttemptResponse>(`ai/quiz-attempts/${attemptId}`);
        } catch (err) {
            if (err instanceof ApiError) throw err;
            throw new Error('Failed to load quiz attempt');
        }
    },
};
