import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CourseAPI } from '@/api/course';

interface Course {
    id: string;
    name: string;
    code: string;
    acadamicYear: number;
    // description: string;
    // instructor: {
    //     name: string;
    //     avatar: string;
    // };
    // image: string;
}

interface CourseState {
    courses: Course[];
    isLoading: boolean;
    error: string | null;

    fetchCourses: () => Promise<void>;
    getCourseById: (courseId: string) => Course | undefined;
    uploadCourse: (courseData: any) => Promise<void>;
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
                    set({ courses: response, isLoading: false });
                } catch (err: any) {
                    set({
                        error: err.message || 'Failed to fetch courses!',
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

            uploadCourse: async (courseData: any) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await CourseAPI.createCourse(courseData);
                    set((state) => ({ courses: [...state.courses, response], isLoading: false }));
                } catch (err: any) {
                    set({
                        error: err.message || 'Failed to upload course!',
                        isLoading: false,
                    });
                    throw err;
                }
            },

            deleteCourse: async (courseId: string) => {
                set({ isLoading: true, error: null });
                try {
                    await CourseAPI.deleteCourse(courseId);
                    set((state) => ({ courses: state.courses.filter(course => course.id !== courseId), isLoading: false }));
                } catch (err: any) {
                    set({
                        error: err.message || 'Failed to delete course!',
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