// import process from "node:process";

import prisma from "../src/config/db";

async function main() {
    const student = await prisma.user.upsert({
        where: { email: "John@uni.test" },
        update: {},
        create: {
            name: "John Doe",
            email: "John@uni.test",
            password: "12345678",
            role: "STUDENT",
        },
    });

    const instructor = await prisma.user.upsert({
        where: { email: "Ins@uni.test" },
        update: {},
        create: {
            name: "Jane Smith",
            email: "Ins@uni.test",
            password: "12345678",
            role: "INSTRUCTOR",
        },
    });

    await prisma.user.upsert({
        where: { email: "Admin@uni.test" },
        update: {},
        create: {
            name: "Joe Herald",
            email: "Admin@uni.test",
            password: "12345678",
            role: "ADMIN",
        },
    });

    const department = await prisma.department.upsert({
        where: { code: "CS101" },
        update: {},
        create: {
            name: "Computer Science",
            code: "CS101",
        },
    });

    const studentProfile = await prisma.studentProfile.upsert({
        where: { id: student.id },
        update: {},
        create: {
            id: student.id,
            studnetId: "UGR/1100/15",
            departmentId: department.id,
            acadamicYear: 2024,
        },
    });

    const instructorProfile = await prisma.instructorProfile.upsert({
        where: { id: instructor.id },
        update: {},
        create: {
            id: instructor.id,
            instructorId: "INS/0001/15",
            departmentId: department.id,
        },
    });

    const course = await prisma.course.upsert({
        where: { code: "AI101" },
        update: {},
        create: {
            name: "Artificial Intelligence",
            code: "AI101",
            acadamicYear: 2024,
            departmentId: department.id,
            instructorId: instructorProfile.id,
        },
    });

    const resource = await prisma.resource.upsert({
        where: { fileUrl: "https://res.cloudinary.com/demo/raw/upload/unilearn/intro-ai.pdf" },
        update: {
            status: "READY",
        },
        create: {
            title: "Intro to AI",
            type: "PDF",
            fileUrl: "https://res.cloudinary.com/demo/raw/upload/unilearn/intro-ai.pdf",
            status: "READY",
            courseId: course.id,
            instructorId: instructorProfile.id,
            version: 1.0,
        },
    });

    await prisma.resourceChunk.upsert({
        where: {
            resourceId_chunkIndex: {
                resourceId: resource.id,
                chunkIndex: 0,
            },
        },
        update: {
            pageNumber: 1,
            content: "Artificial Intelligence introduces systems that reason and learn from data.",
            tokenCount: 13,
            embedding: [0.01, 0.02, 0.03],
        },
        create: {
            resourceId: resource.id,
            chunkIndex: 0,
            pageNumber: 1,
            content: "Artificial Intelligence introduces systems that reason and learn from data.",
            tokenCount: 13,
            embedding: [0.01, 0.02, 0.03],
        },
    });

    const summaryId = "11111111-1111-1111-1111-111111111111";
    const quizId = "22222222-2222-2222-2222-222222222222";
    const questionId = "33333333-3333-3333-3333-333333333333";
    const attemptId = "44444444-4444-4444-4444-444444444444";
    const progressId = "55555555-5555-5555-5555-555555555555";

    await prisma.summary.upsert({
        where: { id: summaryId },
        update: {},
        create: {
            id: summaryId,
            content: "Summary",
            resourceId: resource.id,
            studnetId: studentProfile.id,
        },
    });

    const quiz = await prisma.quiz.upsert({
        where: { id: quizId },
        update: {},
        create: {
            id: quizId,
            title: "A Quiz on AI",
            difficulty: "MEDIUM",
            resourceId: resource.id,
            studnetId: student.id,
        },
    });

    await prisma.question.upsert({
        where: { id: questionId },
        update: {},
        create: {
            id: questionId,
            content: "What is AI?",
            options: {},
            correctAns: "A",
            quizId: quiz.id,
        },
    });

    await prisma.quizAttempt.upsert({
        where: { id: attemptId },
        update: {},
        create: {
            id: attemptId,
            score: 10,
            quizId: quiz.id,
            studnetId: studentProfile.id,
        },
    });

    await prisma.progress.upsert({
        where: {
            studnetId_courseId: {
                studnetId: studentProfile.id,
                courseId: course.id,
            },
        },
        update: {},
        create: {
            id: progressId,
            resourceViewed: 3,
            averageScore: 9,
            studnetId: studentProfile.id,
            courseId: course.id,
        },
    });

    console.log("Seed Complete!");
    console.log("Student: John@uni.test / 12345678");
    console.log("Instructor: Ins@uni.test / 12345678");
    console.log("Admin: Admin@uni.test / 12345678");
    console.log(`Created ${await prisma.course.count()} course(s)`);
    console.log(`Created ${await prisma.resource.count()} resource(s)`);
    console.log(`Created ${await prisma.resourceChunk.count()} resource chunk(s)`);
    console.log(`Created ${await prisma.quiz.count()} quiz(zes)`);
}

main()
    .catch(e => {
        console.error(e);
        // process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });