import { api, ApiError } from './client';

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

export function askResourceErrorMessage(err: unknown): string {
    if (err instanceof ApiError) {
        const fromBody = messageFromApiData(err.data);
        const lower = (fromBody ?? '').toLowerCase();

        if (err.status === 400 && (lower.includes('not indexed') || lower.includes('no vectorized chunks'))) {
            return 'This material is still being processed. Try again after upload finishes.';
        }
        if (err.status === 408) {
            return 'Request timed out — try a shorter question.';
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

export const AiAPI = {
    askResource: async (body: { resourceId: string; question: string; topK?: number }) => {
        try {
            return await api.post<AskResourceResponse>('ai/ask', body, { timeout: 120_000 });
        } catch (err) {
            if (err instanceof ApiError) throw err;
            throw new Error('AI request failed');
        }
    },
};
