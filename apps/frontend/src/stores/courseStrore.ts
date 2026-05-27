import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CourseAPI, type CourseCatalogRow } from '@/api/course';
import type { CreateCourseInput } from "@unilearn/shared-types";

interface CourseState {
    courses: CourseCatalogRow[];
    isLoading: boolean;
    error: string | null;

    fetchCourses: () => Promise<void>;
    getCourseById: (courseId: string) => CourseCatalogRow | undefined;
    uploadCourse: (courseData: CreateCourseInput) => Promise<void>;
    deleteCourse: (courseId: string) => Promise<void>;
}

export const useCourseStore = create<CourseState>() (
    persist(
        (set, get) => ({
            courses: [],
            isLoading: false,
            error: null,

            fetchCourses: async () => {
                set({ isLoading: true, error: null });
                try {
                    const response = await CourseAPI.getAllCourses();
                    const courses: CourseCatalogRow[] = response.map((course) => ({
                        id: course.id,
                        name: course.name,
                        code: course.code,
                        acadamicYear: course.acadamicYear,
                        instructorId: course.instructorId,
                        departmentId: course.departmentId,
                        instructorName: course.instructorName,
                        resources: course.resources,
                    }));
                    set({ courses, isLoading: false });
                } catch (err: unknown) {
                    set({
                        error: err instanceof Error ? err.message : 'Failed to fetch courses!',
                        isLoading: false,
                    });
                    throw err;
                }
            },

            // i need explanation about the get() works here?
            getCourseById: (courseId: string) => {
                const { courses } = get();
                return courses.find(course => course.id === courseId);
            },

            uploadCourse: async (courseData: CreateCourseInput) => {
                set({ isLoading: true, error: null });
                try {
                    await CourseAPI.createCourse(courseData);
                    await get().fetchCourses();
                    set({ isLoading: false });
                } catch (err: unknown) {
                    set({
                        error: err instanceof Error ? err.message : 'Failed to upload course!',
                        isLoading: false,
                    });
                    throw err;
                }
            },

            deleteCourse: async (courseId: string) => {
                set({ isLoading: true, error: null });
                try {
                    await CourseAPI.deleteCourse(courseId);
                    set((state: { courses: CourseCatalogRow[]; }) => ({
                        courses: state.courses.filter((course) => course.id !== courseId),
                        isLoading: false,
                    }));
                } catch (err: unknown) {
                    set({
                        error: err instanceof Error ? err.message : 'Failed to delete course!',
                        isLoading: false,
                    });
                    throw err;
                }
            },
        }),
        {
            name: 'course-store',
            partialize: (state) => ({ courses: state.courses }),
        }
    )
);