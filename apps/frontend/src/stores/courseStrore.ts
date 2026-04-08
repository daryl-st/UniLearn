import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CourseAPI } from '@/api/course';

interface Course {
    id: string; // i believe we don't need this for now.
    name: string;
    code: string;
    instructor: string;
    discipline: string;
    image?: string;
    acadamicYear: number;
    // description: string;
    // instructor: {
    //     name: string;
    //     avatar: string;
    // };
}

// interface CourseResponse {
//     id: string;
//     name: string;
//     code: string;
//     instructorName: string;
//     departmentName: string;
//     image?: string;
//     acadamicYear: number;
// }   

interface CourseUploadData {
    name: string;
    code: string;
    instructor: string;
    discipline: string;
    image?: string; // course image
    acadamicYear: number;
    // description: string;
}

interface CourseState {
    courses: Course[];
    isLoading: boolean;
    error: string | null;

    fetchCourses: () => Promise<void>;
    getCourseById: (courseId: string) => Course | undefined;
    uploadCourse: (courseData: CourseUploadData) => Promise<void>;
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
                    // Map CourseResponse to Course
                    const courses: Course[] = response.map((course: any) => ({ // will be edited later to course response
                        id: course.id,
                        name: course.name,
                        code: course.code,
                        acadamicYear: course.acadamicYear,
                        instructor: course.instructorName ?? '',
                        discipline: course.departmentName ?? '',
                        image: course.image,
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

            uploadCourse: async (courseData: CourseUploadData) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await CourseAPI.createCourse(courseData);
                    set((state: { courses: any; }) => ({ courses: [...state.courses, response], isLoading: false }));
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
                    set((state) => ({ courses: state.courses.filter(course => course.id !== courseId), isLoading: false }));
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