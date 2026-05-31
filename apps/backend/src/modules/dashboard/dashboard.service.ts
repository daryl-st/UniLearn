import prisma from "../../config/db.js";
import { UserRepository } from "../user/user.repository.js";
import { CourseRepository, ResourceRepository } from "../resource/resource.repository.js";

export class DashboardService {
    constructor(
        private userRepository: UserRepository,
        private courseRepository: CourseRepository,
        private resourceRepository: ResourceRepository
    ) {}

    async getAdminStats() {
        const [totalUsers, totalStudents, totalInstructors, totalCourses, totalResources, totalQuizAttempts] = await Promise.all([
            this.userRepository.countAllUsers(),
            this.userRepository.countStudents(),
            this.userRepository.countInstructors(),
            this.courseRepository.countAll(),
            this.resourceRepository.countAll(),
            prisma.quizAttempt.count()
        ]);

        return {
            totalUsers,
            totalStudents,
            totalInstructors,
            totalCourses,
            totalResources,
            totalQuizAttempts
        };
    }

    async getInstructorStats(instructorId: string) {
        // Fetch stats counts
        const [assignedCoursesCount, uploadedResourcesCount, recentQuizAttemptsCount, avgScoreRes] = await Promise.all([
            this.courseRepository.countByInstructor(instructorId),
            this.resourceRepository.countByInstructor(instructorId),
            prisma.quizAttempt.count({
                where: {
                    quiz: {
                        resource: {
                            instructorId: instructorId
                        }
                    },
                    createdAt: {
                        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                    }
                }
            }),
            prisma.quizAttempt.aggregate({
                where: {
                    quiz: {
                        resource: {
                            instructorId: instructorId
                        }
                    }
                },
                _avg: {
                    score: true
                }
            })
        ]);

        const avgStudentScore = avgScoreRes._avg.score !== null ? Math.round(avgScoreRes._avg.score * 10) / 10 : 0;

        // Fetch courses list with student progress
        const courses = await this.courseRepository.findByInstructor(instructorId);
        const coursesWithStats = await Promise.all(
            courses.map(async (course) => {
                const [resourceCount, progressRecords] = await Promise.all([
                    prisma.resource.count({
                        where: { courseId: course.id, isDeleted: false }
                    }),
                    prisma.progress.findMany({
                        where: { courseId: course.id }
                    })
                ]);

                const enrolled = progressRecords.length;
                let avgProgress = 0;
                if (enrolled > 0 && resourceCount > 0) {
                    const sum = progressRecords.reduce((acc, curr) => acc + curr.resourceViewed, 0);
                    // avg progress = sum of viewed / (enrolled * total resources) * 100
                    avgProgress = Math.round((sum / (enrolled * resourceCount)) * 100);
                }

                return {
                    id: course.id,
                    title: `${course.name} (${course.code})`,
                    description: `Academic Year ${course.acadamicYear}`,
                    progress: Math.min(avgProgress, 100),
                    enrolled: String(enrolled),
                    tag: `YEAR ${course.acadamicYear}`,
                    image: `https://picsum.photos/seed/${course.code}/800/400`
                };
            })
        );

        return {
            assignedCoursesCount,
            uploadedResourcesCount,
            recentQuizAttemptsCount,
            avgStudentScore,
            courses: coursesWithStats
        };
    }

    async getStudentStats(studentId: string) {
        // Find enrolled course IDs through Progress records
        const enrolledCourses = await prisma.progress.findMany({
            where: { studnetId: studentId },
            select: { courseId: true }
        });
        const enrolledCourseIds = enrolledCourses.map((c) => c.courseId);

        const [enrolledCoursesCount, avgScoreRes, quizAttemptsCount, learningMaterialsCount] = await Promise.all([
            prisma.progress.count({
                where: { studnetId: studentId }
            }),
            prisma.quizAttempt.aggregate({
                where: { studnetId: studentId },
                _avg: { score: true }
            }),
            prisma.quizAttempt.count({
                where: { studnetId: studentId }
            }),
            prisma.resource.count({
                where: {
                    courseId: { in: enrolledCourseIds },
                    isDeleted: false
                }
            })
        ]);

        const avgQuizScore = avgScoreRes._avg.score !== null ? Math.round(avgScoreRes._avg.score * 10) / 10 : null;

        return {
            enrolledCoursesCount,
            avgQuizScore,
            quizAttemptsCount,
            learningMaterialsCount
        };
    }
}
