import { api, ApiError } from "./client";

export interface AdminStats {
    totalUsers: number;
    totalStudents: number;
    totalInstructors: number;
    totalCourses: number;
    totalResources: number;
    totalQuizAttempts: number;
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
}

export interface StudentStats {
    enrolledCoursesCount: number;
    avgQuizScore: number | null;
    quizAttemptsCount: number;
    learningMaterialsCount: number;
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
