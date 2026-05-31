import { api, ApiError } from "./client";

export interface AdminStats {
    totalUsers: number;
    totalStudents: number;
    totalInstructors: number;
    totalCourses: number;
    totalResources: number;
    totalQuizAttempts: number;
    recentCourses?: Array<{ id: string; name: string; code: string; createdAt: string }>;
    recentResources?: Array<{ id: string; title: string; type: string; createdAt: string }>;
    instructorCourseStats?: { totalCourses: number; mappedCourses: number };
    resourceAnalytics?: { byStatus: Record<string, number>; byType: Record<string, number> };
    avgQuizScore?: number;
    weeklyUserGrowth?: Array<{ name: string; value: number; tone: string }>;
}

export interface InstructorCourse {
    id: string;
    title: string;
    description: string;
    progress: number;
    enrolled: string;
    tag: string;
    image: string;
}

export interface InstructorStats {
    assignedCoursesCount: number;
    uploadedResourcesCount: number;
    recentQuizAttemptsCount: number;
    avgStudentScore: number;
    courses: InstructorCourse[];
    dropoffData?: Array<{ mod: string; engagement: number; status: string }>;
    calibrationData?: Array<{ name: string; actual: number; target: number }>;
    atRiskCohort?: Array<{ id: string; name: string; uid: string; gap: string; score: string; image: string }>;
}

export interface StudentStats {
    enrolledCoursesCount: number;
    avgQuizScore: number | null;
    quizAttemptsCount: number;
    learningMaterialsCount: number;
    overallProgress?: number;
    coursesProgressDetails?: Array<{
        iconName: string;
        title: string;
        subtitle: string;
        metricLabel: string;
        metricValue: string;
        status: string;
        completed: boolean;
    }>;
    activityPulse?: number[];
    monthlyPerformance?: Array<{ month: string; score: number }>;
}

export const DashboardAPI = {
    getAdminStats: async (): Promise<AdminStats> => {
        try {
            return await api.get<AdminStats>("dashboard/admin");
        } catch (err) {
            if (err instanceof ApiError) {
                throw err;
            }
            throw new Error("Failed to fetch admin stats");
        }
    },

    getInstructorStats: async (): Promise<InstructorStats> => {
        try {
            return await api.get<InstructorStats>("dashboard/instructor");
        } catch (err) {
            if (err instanceof ApiError) {
                throw err;
            }
            throw new Error("Failed to fetch instructor stats");
        }
    },

    getStudentStats: async (): Promise<StudentStats> => {
        try {
            return await api.get<StudentStats>("dashboard/student");
        } catch (err) {
            if (err instanceof ApiError) {
                throw err;
            }
            throw new Error("Failed to fetch student stats");
        }
    },
};
