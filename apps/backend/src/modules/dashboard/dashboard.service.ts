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
        const [
            totalUsers,
            totalStudents,
            totalInstructors,
            totalCourses,
            totalResources,
            totalQuizAttempts,
            recentCourses,
            recentResources,
            instructorCourseStats,
            resourceAnalytics,
            avgScoreRes
        ] = await Promise.all([
            this.userRepository.countAllUsers(),
            this.userRepository.countStudents(),
            this.userRepository.countInstructors(),
            this.courseRepository.countAll(),
            this.resourceRepository.countAll(),
            prisma.quizAttempt.count(),
            this.courseRepository.getRecentCourses(5),
            this.resourceRepository.getRecentResources(5),
            this.courseRepository.getInstructorCourseStats(),
            this.resourceRepository.getResourceAnalytics(),
            prisma.quizAttempt.aggregate({
                _avg: { score: true }
            })
        ]);

        // Daily user sign-ups for the last 16 days
        const weeklyUserGrowth = [];
        for (let i = 15; i >= 0; i--) {
            const start = new Date();
            start.setHours(0, 0, 0, 0);
            start.setDate(start.getDate() - i);
            
            const end = new Date();
            end.setHours(23, 59, 59, 999);
            end.setDate(end.getDate() - i);

            const count = await prisma.user.count({
                where: {
                    createdAt: { gte: start, lte: end }
                }
            });

            const days = ["S", "M", "T", "W", "T", "F", "S"];
            weeklyUserGrowth.push({
                name: days[start.getDay()],
                value: count,
                tone: i === 0 ? "primary" : i % 3 === 0 ? "primary" : i % 3 === 1 ? "secondary" : "muted"
            });
        }

        const avgQuizScore = avgScoreRes._avg.score !== null ? Math.round(avgScoreRes._avg.score * 10) / 10 : 0;

        return {
            totalUsers,
            totalStudents,
            totalInstructors,
            totalCourses,
            totalResources,
            totalQuizAttempts,
            recentCourses,
            recentResources,
            instructorCourseStats,
            resourceAnalytics,
            avgQuizScore,
            weeklyUserGrowth
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

        // Engagement over time (last 8 weeks)
        const dropoffData = [];
        for (let i = 7; i >= 0; i--) {
            const start = new Date(Date.now() - (i + 1) * 7 * 24 * 60 * 60 * 1000);
            const end = new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000);
            
            const [progressCount, attemptsCount] = await Promise.all([
                prisma.progress.count({
                    where: {
                        course: { instructorId: instructorId },
                        updatedAt: { gte: start, lte: end }
                    }
                }),
                prisma.quizAttempt.count({
                    where: {
                        quiz: { resource: { instructorId: instructorId } },
                        createdAt: { gte: start, lte: end }
                    }
                })
            ]);
            
            const rawScore = progressCount * 10 + attemptsCount * 5;
            const engagementValue = Math.min(Math.max(rawScore, 30), 100);

            dropoffData.push({
                mod: `W${8 - i}`,
                engagement: engagementValue,
                status: engagementValue < 45 ? "critical" : "normal"
            });
        }

        // At-risk students
        const atRiskProgress = await prisma.progress.findMany({
            where: {
                course: { instructorId: instructorId },
                averageScore: { lt: 65 }
            },
            include: {
                student: {
                    include: {
                        student: true
                    }
                }
            },
            take: 3
        });

        const atRiskCohort = atRiskProgress.map((p, index) => {
            const gapDays = Math.ceil((Date.now() - p.updatedAt.getTime()) / (1000 * 60 * 60 * 24));
            return {
                id: String(index + 1),
                name: p.student.student.name,
                uid: p.student.studnetId,
                gap: `${String(gapDays).padStart(2, "0")} Days`,
                score: `${Math.round(p.averageScore)}%`,
                image: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(p.student.student.name)}`
            };
        });

        // Target vs actual performance calibration
        const calibrationData = [
            { name: "0", actual: Math.round(avgStudentScore * 0.9) || 70, target: 80 },
            { name: "25", actual: Math.round(avgStudentScore * 0.95) || 75, target: 75 },
            { name: "50", actual: Math.round(avgStudentScore * 0.8) || 60, target: 70 },
            { name: "75", actual: Math.round(avgStudentScore * 0.85) || 65, target: 65 },
            { name: "100", actual: Math.round(avgStudentScore) || 76, target: 50 },
        ];

        return {
            assignedCoursesCount,
            uploadedResourcesCount,
            recentQuizAttemptsCount,
            avgStudentScore,
            courses: coursesWithStats,
            dropoffData,
            calibrationData,
            atRiskCohort
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

        // Find enrolled courses with progress details
        const studentProgress = await prisma.progress.findMany({
            where: { studnetId: studentId },
            include: {
                course: {
                    include: {
                        resources: {
                            where: { isDeleted: false }
                        }
                    }
                }
            }
        });

        let totalEnrolledResources = 0;
        let totalViewedResources = 0;
        const coursesProgressDetails = studentProgress.map((p, index) => {
            const courseResourcesCount = p.course.resources.length;
            totalEnrolledResources += courseResourcesCount;
            totalViewedResources += p.resourceViewed;
            
            const progressPercent = courseResourcesCount > 0 
                ? Math.round((p.resourceViewed / courseResourcesCount) * 100) 
                : 0;

            const iconNames = ["BookOpen", "Database", "FileText"];
            const iconName = iconNames[index % iconNames.length];

            return {
                iconName,
                title: `${p.course.code} — ${p.course.name}`,
                subtitle: `${courseResourcesCount} resources · ${p.resourceViewed} reviewed`,
                metricLabel: "Progress",
                metricValue: `${Math.min(progressPercent, 100)}%`,
                status: progressPercent >= 100 ? "Completed" : `${Math.min(progressPercent, 100)}% complete`,
                completed: progressPercent >= 100
            };
        });

        const overallProgress = totalEnrolledResources > 0
            ? Math.round((totalViewedResources / totalEnrolledResources) * 100)
            : 0;

        // Calculate activity intensities for the last 49 days (7 weeks x 7 days)
        const activityPulse = [];
        for (let i = 48; i >= 0; i--) {
            const startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0);
            startOfDay.setDate(startOfDay.getDate() - i);
            
            const endOfDay = new Date();
            endOfDay.setHours(23, 59, 59, 999);
            endOfDay.setDate(endOfDay.getDate() - i);

            const [attemptsOnDay, progressOnDay] = await Promise.all([
                prisma.quizAttempt.count({
                    where: {
                        studnetId: studentId,
                        createdAt: { gte: startOfDay, lte: endOfDay }
                    }
                }),
                prisma.progress.count({
                    where: {
                        studnetId: studentId,
                        updatedAt: { gte: startOfDay, lte: endOfDay }
                    }
                })
            ]);
            
            const count = attemptsOnDay + progressOnDay;
            const intensity = count === 0 ? 0.1 : Math.min(0.2 + (count * 0.25), 0.95);
            activityPulse.push(intensity);
        }

        // Monthly performance trend for the last 6 months
        const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
        const monthlyPerformance = [];
        const now = new Date();
        for (let i = 5; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
            const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
            
            const avgScore = await prisma.quizAttempt.aggregate({
                where: {
                    studnetId: studentId,
                    createdAt: { gte: startOfMonth, lte: endOfMonth }
                },
                _avg: { score: true }
            });

            monthlyPerformance.push({
                month: months[startOfMonth.getMonth()],
                score: avgScore._avg.score !== null ? Math.round(avgScore._avg.score * 10) / 10 : 0
            });
        }

        return {
            enrolledCoursesCount,
            avgQuizScore,
            quizAttemptsCount,
            learningMaterialsCount,
            overallProgress,
            coursesProgressDetails,
            activityPulse,
            monthlyPerformance
        };
    }
}
