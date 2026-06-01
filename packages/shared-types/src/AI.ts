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

export interface ChatCitation {
    chunkIndex: number;
    pageNumber: number;
    score: number;
}

export interface ChatMessageRecord {
    id: string;
    role: "user" | "assistant";
    content: string;
    citations?: ChatCitation[];
    createdAt: string;
}

export interface GetChatResponse {
    messages: ChatMessageRecord[];
}

export interface AskResourceResponse {
    resourceId: string;
    answer: string;
    citations: ChatCitation[];
    usedChunks: number;
    messages?: ChatMessageRecord[];
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

export interface QuizRecord {
    id: string;
    title: string;
    difficulty: Difficulty;
    resourceId: string;
    createdAt: string;
    attemptCount?: number;
}

export interface QuestionForTaking {
    id: string;
    content: string;
    options?: Record<string, string> | null;
}

export interface GenerateQuizRequest {
    resourceId: string;
    difficulty: Difficulty;
    title?: string;
    maxChunks?: number;
    questionCount?: number;
}

export interface GenerateQuizResponse {
    quiz: QuizRecord;
    questions: QuestionForTaking[];
}

export interface ListQuizzesResponse {
    quizzes: QuizRecord[];
}

export interface GetQuizResponse {
    quiz: QuizRecord;
    questions: QuestionForTaking[];
}

export interface SubmitQuizAnswer {
    questionId: string;
    answer: string;
}

export interface SubmitQuizRequest {
    answers: SubmitQuizAnswer[];
}

export interface QuizQuestionResult {
    questionId: string;
    content: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
}

export interface QuizAttemptRecord {
    id: string;
    score: number;
    quizId: string;
    createdAt: string;
    results: QuizQuestionResult[] | null;
}

export interface SubmitQuizResponse {
    attempt: QuizAttemptRecord;
}

export interface GetQuizAttemptResponse {
    attempt: QuizAttemptRecord;
}

/** @deprecated Use GenerateQuizRequest */
export interface QuizRequest {
    difficulty: Difficulty;
    title: string;
    resourceId: string;
}

/** @deprecated Use GenerateQuizResponse */
export interface QuizResponse {
    difficulty: Difficulty;
    title: string;
    resourceId: string;
    questions: Question[];
}

/** @deprecated Use QuestionForTaking */
export interface Question {
    content: string;
    options?: Record<string, string> | null;
    correctAns: string;
    quizId: string;
}

export interface Progress {
    resouceViewed: number;
    averageScore: number;
    studentId: string;
    courseId: string;
}
