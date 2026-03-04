export type Difficulty = "EASY" | "MEDIUM" | "HARD";

export interface SummaryRequest {
    content: string;
    resourceId: string;
}

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
    averageScore: Number; // maybe float here
    studentId: string;
    courseId: string;
}