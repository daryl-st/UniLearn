import { api, ApiError } from "./client"
import type { Course, UpdateCourseInput } from "@unilearn/shared-types";

export const CourseAPI = {
    getAllCourses: async () => {
        try {
            const response = await api.get<Course[]>('course');

            if (!response || !Array.isArray(response)) {
                throw new Error("Invalid response format!");
            }

            // i believe the response is json so let's just return it as is.
            return response;
        } catch (err) {
            if (err instanceof ApiError) {
                if (err.status == 404) throw new Error("Not Found!");
                throw err;
            }
            throw new Error("Fetching course failed!");
        }
    },
    getCourse: async () => {
        try {
            const response = await api.get<Course>('course/:id');

            return response;
        } catch (err) {
            if (err instanceof ApiError) {
                if (err.status == 404) throw new Error("Not Found!");
                throw err;
            }
            throw new Error("Fetching course failed!");
        }
    },
    createCourse: async (courseData: UpdateCourseInput) => {
        try {
            const response = await api.post<Course>('course', courseData);
            return response;
        } catch (err) {
            if (err instanceof ApiError) {
                if (err.status == 404) throw new Error("Not Found!");
                throw err;
            }
            throw new Error("Creating course failed!");
        }
    },
    deleteCourse: async (courseId: string) => {
        try {
            const response = await api.delete<Course>(`course/${courseId}`);
            return response;
        } catch (err) {
            if (err instanceof ApiError) {
                if (err.status == 404) throw new Error("Not Found!");
                throw err;
            }
            throw new Error("Deleting course failed!");
        }
    },
}