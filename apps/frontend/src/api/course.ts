/* eslint-disable @typescript-eslint/no-explicit-any */
import { api, ApiError } from "./client";
import type { Course, CreateCourseInput, Resource } from "@unilearn/shared-types";

// Row from GET /course (includes display name when backend sends it).
export type CourseCatalogRow = Course & { instructorName?: string };

export const CourseAPI = {
    getAllCourses: async () => {
        try {
            const response = await api.get<CourseCatalogRow[]>("course");

            if (!response || !Array.isArray(response)) {
                throw new Error("Invalid response format!");
            }

            return response;
        } catch (err) {
            if (err instanceof ApiError) {
                if (err.status == 404) throw new Error("Not Found!");
                throw err;
            }
            throw new Error("Fetching course failed!");
        }
    },

    getCourse: async (id: string) => {
        try {
            return await api.get<Course>(`course/${encodeURIComponent(id)}`);
        } catch (err) {
            if (err instanceof ApiError) {
                if (err.status == 404) throw new Error("Not Found!");
                throw err;
            }
            throw new Error("Fetching course failed!");
        }
    },

    getResourcesByCourseId: async (courseId: string) => {
        try {
            return await api.get<Resource[]>("course/resource", {
                params: { courseId },
            });
        } catch (err) {
            if (err instanceof ApiError) {
                if (err.status == 404) throw new Error("Not Found!");
                throw err;
            }
            throw new Error("Fetching resources failed!");
        }
    },

    getResourceById: async (id: string) => {
        try {
            return await api.get<Resource>(`course/resources/${encodeURIComponent(id)}`);
        } catch (err) {
            if (err instanceof ApiError) {
                if (err.status == 404) throw new Error("Not Found!");
                throw err;
            }
            throw new Error("Fetching resource failed!");
        }
    },

    createCourse: async (courseData: CreateCourseInput) => {
        try {
            return await api.post<Course>("course", courseData);
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
            return await api.delete<Course>(`course/${encodeURIComponent(courseId)}`);
        } catch (err) {
            if (err instanceof ApiError) {
                if (err.status == 404) throw new Error("Not Found!");
                throw err;
            }
            throw new Error("Deleting course failed!");
        }
    },

    uploadResource: async (body: {
        title: string;
        type: "PDF" | "PPT" | "DOC";
        fileUrl: string;
        courseId: string;
        instructorId: string;
    } | FormData) => {
        try {
            return await api.post<Resource>("course/resource", body as any);
        } catch (err) {
            if (err instanceof ApiError) {
                throw err;
            }
            throw new Error("Uploading resource failed!");
        }
    },

    deleteResource: async (resourceId: string, instructorId: string) => {
        try {
            return await api.delete<Resource>(`course/resource/${encodeURIComponent(resourceId)}`, {
                body: JSON.stringify({ instructorId }),
            });
        } catch (err) {
            if (err instanceof ApiError) {
                throw err;
            }
            throw new Error("Deleting resource failed!");
        }
    },
};
