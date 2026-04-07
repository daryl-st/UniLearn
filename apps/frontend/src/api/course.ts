import { api, ApiError } from "./client"

interface CourseResponse {
    id: string,
    name: string,
    code: string,
    acadamicYear: number,
}

export const CourseAPI = {
    getAllCourses: async () => {
        try {
            const response = await api.get<CourseResponse[]>('course');

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
            const response = await api.get<CourseResponse>('course/:id');

            return response;
        } catch (err) {
            if (err instanceof ApiError) {
                if (err.status == 404) throw new Error("Not Found!");
                throw err;
            }
            throw new Error("Fetching course failed!");
        }
    },
    createCourse: async (courseData: any) => {
        try {
            const response = await api.post<CourseResponse>('course', courseData);
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
            const response = await api.delete<CourseResponse>(`course/${courseId}`);
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