export type Difficulty = "EASY" | "MEDIUM" | "HARD";

/** Persisted summary row returned by the API. */
export interface SummaryRecord {
    id: string;
    resourceId: string;
    content: string;
    createdAt: string;
}

export interface CreateSummaryRequest {
    resourceId: string;
    maxChunks?: number;
}

export interface CreateSummaryResponse {
    summary: SummaryRecord;
}

export interface ListSummariesResponse {
    summaries: SummaryRecord[];
}

/** @deprecated Use CreateSummaryRequest */
export interface SummaryRequest {
    content: string;
    resourceId: string;
}

/** @deprecated Use CreateSummaryResponse */
export interface SummaryResponse {
    summary: string;
}

export interface QuizRequest {
    difficulty: Difficulty;
    title: string;
    resourceId: string;
}

export interface QuizResponse {
    difficulty: Difficulty;
    title: string;
    resourceId: string;
    questions: Question[];
}

export interface Question {
    content: string;
    options?: JSON;
    correctAns: string;
    quizId: string;
}

export interface QuizAttempt {
    score: Number;
    quizId: string;
    studentId: string;
}

export interface Progress {
    resouceViewed: Number;
    averageScore: Number;
    studentId: string;
    courseId: string;
}
