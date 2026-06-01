/* eslint-disable @typescript-eslint/no-explicit-any */
import { api, ApiError } from "./client";
import type { Course, CreateCourseInput, Resource, UploadResourceResponse, UpdateCourseInput } from "@unilearn/shared-types";

export type CourseWithInstructor = Course & {
    instructorNames?: string[];
};
export type CourseCatalogRow = CourseWithInstructor;

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
            return await api.get<CourseWithInstructor>(`course/${encodeURIComponent(id)}`);
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

    /** Fetch resource bytes via API proxy (avoids Cloudinary CORS limits in PDF.js). */
    fetchResourceFile: async (resourceId: string): Promise<ArrayBuffer> => {
        try {
            return await api.get<ArrayBuffer>(`course/resources/${encodeURIComponent(resourceId)}/file`, {
                responseType: 'arrayBuffer',
            });
        } catch (err) {
            if (err instanceof ApiError) throw err;
            throw new Error("Fetching resource file failed!");
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

    updateCourse: async (courseId: string, courseData: UpdateCourseInput) => {
        try {
            return await api.put<Course>(`course/${encodeURIComponent(courseId)}`, courseData);
        } catch (err) {
            if (err instanceof ApiError) {
                if (err.status == 404) throw new Error("Not Found!");
                throw err;
            }
            throw new Error("Updating course failed!");
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

    assignInstructor: async (courseId: string, instructorId: string) => {
        try {
            return await api.post<{ ok: true }>(`course/${encodeURIComponent(courseId)}/instructors`, {
                instructorId,
            });
        } catch (err) {
            if (err instanceof ApiError) {
                throw err;
            }
            throw new Error("Assigning instructor failed!");
        }
    },

    unassignInstructor: async (courseId: string, instructorId: string) => {
        try {
            return await api.delete<{ ok: true }>(`course/${encodeURIComponent(courseId)}/instructors/${encodeURIComponent(instructorId)}`);
        } catch (err) {
            if (err instanceof ApiError) {
                throw err;
            }
            throw new Error("Unassigning instructor failed!");
        }
    },

    getCourseInstructors: async (courseId: string) => {
        try {
            return await api.get<{ instructors: Array<{ id: string; name: string }>; instructorNames?: string[] }>(`course/${encodeURIComponent(courseId)}/instructors`);
        } catch (err) {
            if (err instanceof ApiError) {
                throw err;
            }
            throw new Error("Fetching course instructors failed!");
        }
    },

    uploadResource: async (body: FormData) => {
        try {
            return await api.post<UploadResourceResponse>("course/resource", body as any);
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
