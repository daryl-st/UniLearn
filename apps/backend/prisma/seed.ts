import prisma from "../src/config/db"; 

async function main() {
    const student = await prisma.user.upsert({
        where: { email: "John@uni.test"},
        update: {},
        create: {
            firstName: "John",
            lastName: "Don",
            email: "John@uni.test",
            passwordHash: "12345678",
            role: "STUDENT",
        }
    });

    const Instructor = await prisma.user.upsert({
        where: {email: "Ins@uni.test"},
        update: {},
        create: {
            firstName: "Mike",
            lastName: "Mosby",
            email: "Ins@uni.test",
            passwordHash: "12345678",
            role: "INSTRUCTOR",
        }
    });

    const Admin = await prisma.user.upsert({
        where: {email: "Admin@uni.test"},
        update: {},
        create: {
            firstName: "Joe",
            lastName: "Herald",
            email: "Admin@uni.test",
            passwordHash: "12345678",
            role: "ADMIN",
        }
    });

    const department = await prisma.department.upsert({
        where: { code: "CS101" },
        update: {},
        create: {
            name: "Computer Science",
            code: "CS101"
        }
    })

    const studentProfile = await prisma.studentProfile.upsert({
        where: {id: student.id},
        update: {},
        create: {
            studnetId: "UGR/1100/15",
            departmentId: department.id,
            acadamicYear: 2024,
        },
    });

    const instructorProfile = await prisma.instructorProfile.upsert({
        where: { id: Instructor.id },
        update: {},
        create: {
            instructorId: "INS/0001/15",
            departmentId: department.id,
        } 
    });

    const course = await prisma.course.upsert({
        where: { code: "CS101" },
        update: {},
        create: {
            name: "Artificial Intelligence",
            code: "AI101",
            acadamicYear: 2024,
            departmentId: department.id,
            instructorId: instructorProfile.id
        }
    });

    const resource = await prisma.resource.upsert({
        where: {id: "001"},
        update: {},
        create: {
            title: "Intro to AI",
            type: "PDF",
            fileUrl: "cloudinary_url",
            courseId: course.id,
            instructorId: instructorProfile.id,
        }
    });

    const summary = await prisma.summary.upsert({
        where: {id: "001"},
        update: {},
        create: {
            content: "Summary",
            resourceId: resource.id,
            studnetId: studentProfile.id,
        }
    });

    const quiz = await prisma.quiz.upsert({
        where: { id: "001" },
        update: {},
        create: {
            title: "A Quiz on AI",
            difficulty: "MEDIUM",
            resourceId: resource.id,
            studnetId: student.id
        }
    });

    const question = await prisma.question.upsert({
        where: { id: "001" },
        update: {},
        create: {
            content: "What is AI?",
            options: {},
            correctAns: 'A',
            quizId: quiz.id
        }
    });

    const attempt = await prisma.quizAttempt.upsert({
        where: { id: "001" },
        update: {},
        create: {
            score: 10,
            quizId: quiz.id,
            studnetId: studentProfile.id,
        }
    });

    const progress = await prisma.progress.upsert({
        where: { id: "001" },
        update: {},
        create: {
            resourceViewed: 3,
            averageScore: 9,
            studnetId: studentProfile.id,
            courseId: course.id
        }
    });
}

console.log("Seed Complete!");
console.log("Student: John@uni.test / 12345678 ");
console.log("Instructor: Ins@uni.test / 12345678 ");
console.log("Admin: Admin@uni.test / 12345678 ");
console.log(`Created ${await prisma.course.count()} course`);
console.log(`Created ${await prisma.resource.count()} resource`);
console.log(`Created ${await prisma.quiz.count()} Quizzes`);

main()
    .catch((e) => {
        console.error(e);
    })
    .finally(async () => {
        await prisma.$disconnect();
    })