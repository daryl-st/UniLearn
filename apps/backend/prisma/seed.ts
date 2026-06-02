import bcrypt from "bcrypt";
import prisma from "../src/config/db";
import { parsePublicIdFromCloudinaryUrl } from "../src/modules/resource/cloudinary.utils.js";

const DEMO_PASSWORD = "12345678";
const BCRYPT_ROUNDS = 10;

async function hashPassword(plain: string): Promise<string> {
    return bcrypt.hash(plain, BCRYPT_ROUNDS);
}

async function main() {
    const passwordHash = await hashPassword(DEMO_PASSWORD);

    await prisma.user.updateMany({
        data: { isVerified: true },
    });

    const student1 = await prisma.user.upsert({
        where: { email: "John@uni.test" },
        update: { password: passwordHash, isVerified: true },
        create: {
            name: "John Doe",
            email: "John@uni.test",
            password: passwordHash,
            role: "STUDENT",
            isVerified: true,
        },
    });

    const student2 = await prisma.user.upsert({
        where: { email: "Mary@uni.test" },
        update: { password: passwordHash, isVerified: true },
        create: {
            name: "Mary Johnson",
            email: "Mary@uni.test",
            password: passwordHash,
            role: "STUDENT",
            isVerified: true,
        },
    });

    const student3 = await prisma.user.upsert({
        where: { email: "Alex@uni.test" },
        update: { password: passwordHash, isVerified: true },
        create: {
            name: "Alex Chen",
            email: "Alex@uni.test",
            password: passwordHash,
            role: "STUDENT",
            isVerified: true,
        },
    });

    const mobileStudent = await prisma.user.upsert({
        where: { email: "m@aau.edu.et" },
        update: { password: passwordHash, isVerified: true },
        create: {
            name: "Mobile Test",
            email: "m@aau.edu.et",
            password: passwordHash,
            role: "STUDENT",
            isVerified: true,
        },
    });

    const aauStudent = await prisma.user.upsert({
        where: { email: "student@aau.edu.et" },
        update: { password: passwordHash, isVerified: true },
        create: {
            name: "AAU Student",
            email: "student@aau.edu.et",
            password: passwordHash,
            role: "STUDENT",
            isVerified: true,
        },
    });

    const instructor1 = await prisma.user.upsert({
        where: { email: "Ins@uni.test" },
        update: { password: passwordHash, isVerified: true },
        create: {
            name: "Dr. Jane Smith",
            email: "Ins@uni.test",
            password: passwordHash,
            role: "INSTRUCTOR",
            isVerified: true,
        },
    });

    const instructor2 = await prisma.user.upsert({
        where: { email: "Samuel@uni.test" },
        update: { password: passwordHash, isVerified: true },
        create: {
            name: "Prof. Samuel Alemayehu",
            email: "Samuel@uni.test",
            password: passwordHash,
            role: "INSTRUCTOR",
            isVerified: true,
        },
    });

    const admin = await prisma.user.upsert({
        where: { email: "Admin@uni.test" },
        update: { password: passwordHash, isVerified: true },
        create: {
            name: "Joe Herald",
            email: "Admin@uni.test",
            password: passwordHash,
            role: "ADMIN",
            isVerified: true,
        },
    });

    /** MVP: single department — Computer Science only. */
    const deptCS = await prisma.department.upsert({
        where: { code: "CS101" },
        update: {},
        create: {
            name: "Computer Science",
            code: "CS101",
        },
    });

    await prisma.studentProfile.upsert({
        where: { id: student1.id },
        update: { departmentId: deptCS.id },
        create: {
            id: student1.id,
            studnetId: "UGR/1100/15",
            departmentId: deptCS.id,
            acadamicYear: 3,
        },
    });

    await prisma.studentProfile.upsert({
        where: { id: student2.id },
        update: { departmentId: deptCS.id },
        create: {
            id: student2.id,
            studnetId: "UGR/1101/16",
            departmentId: deptCS.id,
            acadamicYear: 2,
        },
    });

    await prisma.studentProfile.upsert({
        where: { id: student3.id },
        update: { departmentId: deptCS.id },
        create: {
            id: student3.id,
            studnetId: "UGR/1102/17",
            departmentId: deptCS.id,
            acadamicYear: 1,
        },
    });

    await prisma.studentProfile.upsert({
        where: { id: mobileStudent.id },
        update: { departmentId: deptCS.id },
        create: {
            id: mobileStudent.id,
            studnetId: "UGR/MOBILE01",
            departmentId: deptCS.id,
            acadamicYear: 2,
        },
    });

    await prisma.studentProfile.upsert({
        where: { id: aauStudent.id },
        update: { departmentId: deptCS.id },
        create: {
            id: aauStudent.id,
            studnetId: "UGR/MOBILE02",
            departmentId: deptCS.id,
            acadamicYear: 1,
        },
    });

    const profileIns1 = await prisma.instructorProfile.upsert({
        where: { id: instructor1.id },
        update: { departmentId: deptCS.id },
        create: {
            id: instructor1.id,
            instructorId: "INS/0001/15",
            departmentId: deptCS.id,
        },
    });

    const profileIns2 = await prisma.instructorProfile.upsert({
        where: { id: instructor2.id },
        update: { departmentId: deptCS.id },
        create: {
            id: instructor2.id,
            instructorId: "INS/0002/15",
            departmentId: deptCS.id,
        },
    });

    type CourseSeed = {
        code: string;
        name: string;
        year: number;
        deptId: string;
        instructorProfileId: string;
    };

    const courseDefs: CourseSeed[] = [
        {
            code: "COSC4411",
            name: "Artificial Intelligence",
            year: 4,
            deptId: deptCS.id,
            instructorProfileId: profileIns1.id,
        },
        {
            code: "COSC3312",
            name: "Database Systems",
            year: 3,
            deptId: deptCS.id,
            instructorProfileId: profileIns1.id,
        },
        {
            code: "COSC2210",
            name: "Data Structures and Algorithms",
            year: 2,
            deptId: deptCS.id,
            instructorProfileId: profileIns1.id,
        },
        {
            code: "COSC1205",
            name: "Programming Fundamentals",
            year: 1,
            deptId: deptCS.id,
            instructorProfileId: profileIns1.id,
        },
        {
            code: "SENG2101",
            name: "Software Engineering",
            year: 2,
            deptId: deptCS.id,
            instructorProfileId: profileIns2.id,
        },
        {
            code: "SENG3102",
            name: "Web Application Development",
            year: 3,
            deptId: deptCS.id,
            instructorProfileId: profileIns2.id,
        },
        {
            code: "MATH1101",
            name: "Discrete Mathematics",
            year: 1,
            deptId: deptCS.id,
            instructorProfileId: profileIns2.id,
        },
        {
            code: "COSC3320",
            name: "Computer Networks",
            year: 3,
            deptId: deptCS.id,
            instructorProfileId: profileIns1.id,
        },
    ];

    const courses: Awaited<ReturnType<typeof prisma.course.upsert>>[] = [];
    for (const c of courseDefs) {
        const row = await prisma.course.upsert({
            where: { code: c.code },
            update: {
                name: c.name,
                acadamicYear: c.year,
                departmentId: c.deptId,
                instructorId: c.instructorProfileId,
            },
            create: {
                name: c.name,
                code: c.code,
                acadamicYear: c.year,
                departmentId: c.deptId,
                instructorId: c.instructorProfileId,
            },
        });
        await prisma.courseInstructor.upsert({
            where: {
                courseId_instructorId: {
                    courseId: row.id,
                    instructorId: c.instructorProfileId,
                },
            },
            update: {},
            create: {
                courseId: row.id,
                instructorId: c.instructorProfileId,
            },
        });
        courses.push(row);
    }

    const aiCourse = courses.find((x) => x.code === "COSC4411")!;
    const dbCourse = courses.find((x) => x.code === "COSC3312")!;
    const dsaCourse = courses.find((x) => x.code === "COSC2210")!;
    const webCourse = courses.find((x) => x.code === "SENG3102")!;

    /** Remove stale resources not in the demo seed list (keeps Cloudinary uploads). */
    const demoFileUrls = [
        "https://www.w3.org/WAI/WCAG21/working-examples/pdf-img/dummy.pdf",
        "https://arxiv.org/pdf/1706.03762.pdf",
        "https://unilearn-seed.local/resources/cosc4411/lecture02-search.pdf",
        "https://unilearn-seed.local/resources/cosc3312/normalization-slides.pptx",
        "https://unilearn-seed.local/resources/cosc3312/sql-lab.docx",
        "https://unilearn-seed.local/resources/cosc2210/big-o-handout.pdf",
        "https://unilearn-seed.local/resources/cosc2210/trees-avl.pptx",
        "https://unilearn-seed.local/resources/seng3102/rest-api-notes.pdf",
        "https://unilearn-seed.local/resources/seng3102/react-intro.pptx",
        "https://unilearn-seed.local/resources/seng3102/deployment.docx",
    ];
    const staleResources = await prisma.resource.findMany({
        where: {
            fileUrl: { notIn: demoFileUrls },
            NOT: { fileUrl: { contains: "res.cloudinary.com" } },
        },
        select: { id: true },
    });
    const staleResourceIds = staleResources.map((r) => r.id);
    if (staleResourceIds.length > 0) {
        await prisma.quizAttempt.deleteMany({
            where: { quiz: { resourceId: { in: staleResourceIds } } },
        });
        await prisma.question.deleteMany({
            where: { quiz: { resourceId: { in: staleResourceIds } } },
        });
        await prisma.quiz.deleteMany({ where: { resourceId: { in: staleResourceIds } } });
        await prisma.summary.deleteMany({ where: { resourceId: { in: staleResourceIds } } });
        await prisma.resourceChunk.deleteMany({ where: { resourceId: { in: staleResourceIds } } });
        await prisma.resource.deleteMany({ where: { id: { in: staleResourceIds } } });
        console.log(`Removed ${staleResourceIds.length} stale non-demo resource(s).`);
    }

    /** Backfill Cloudinary public IDs for existing delivery URLs. */
    const missingPublicId = await prisma.resource.findMany({
        where: {
            fileUrl: { contains: "res.cloudinary.com" },
            cloudinaryPublicId: null,
        },
    });
    for (const row of missingPublicId) {
        const publicId = parsePublicIdFromCloudinaryUrl(row.fileUrl);
        if (!publicId) continue;
        await prisma.resource.update({
            where: { id: row.id },
            data: {
                cloudinaryPublicId: publicId,
                ...(row.type === "PDF" && row.status === "QUEUED" ? { status: "READY" } : {}),
            },
        });
    }
    if (missingPublicId.length > 0) {
        console.log(`Backfilled Cloudinary public IDs for ${missingPublicId.length} resource(s).`);
    }

    /** Resource-view progress for mobile dev account (before demo materials). */
    await prisma.progress.upsert({
        where: {
            studnetId_courseId: {
                studnetId: mobileStudent.id,
                courseId: aiCourse.id,
            },
        },
        update: { resourceViewed: 3, averageScore: 78 },
        create: {
            id: "00000000-0000-4000-8000-000000000008",
            resourceViewed: 3,
            averageScore: 78,
            studnetId: mobileStudent.id,
            courseId: aiCourse.id,
        },
    });

    await prisma.progress.upsert({
        where: {
            studnetId_courseId: {
                studnetId: mobileStudent.id,
                courseId: dsaCourse.id,
            },
        },
        update: { resourceViewed: 1, averageScore: 68 },
        create: {
            id: "00000000-0000-4000-8000-000000000009",
            resourceViewed: 1,
            averageScore: 68,
            studnetId: mobileStudent.id,
            courseId: dsaCourse.id,
        },
    });

    await prisma.progress.upsert({
        where: {
            studnetId_courseId: {
                studnetId: mobileStudent.id,
                courseId: webCourse.id,
            },
        },
        update: { resourceViewed: 2, averageScore: 81 },
        create: {
            id: "00000000-0000-4000-8000-000000000010",
            resourceViewed: 2,
            averageScore: 81,
            studnetId: mobileStudent.id,
            courseId: webCourse.id,
        },
    });

    type ResSeed = {
        fileUrl: string;
        title: string;
        type: "PDF" | "PPT" | "DOC";
        courseId: string;
        instructorUserId: string;
        instructorProfileId: string;
        version: number;
    };

    const resourceSeeds: ResSeed[] = [
        {
            fileUrl: "https://www.w3.org/WAI/WCAG21/working-examples/pdf-img/dummy.pdf",
            title: "AI Syllabus and grading rubric",
            type: "PDF",
            courseId: aiCourse.id,
            instructorUserId: instructor1.id,
            instructorProfileId: profileIns1.id,
            version: 1,
        },
        {
            fileUrl: "https://arxiv.org/pdf/1706.03762.pdf",
            title: "Attention Is All You Need (reference reading)",
            type: "PDF",
            courseId: aiCourse.id,
            instructorUserId: instructor1.id,
            instructorProfileId: profileIns1.id,
            version: 1,
        },
        {
            fileUrl: "https://unilearn-seed.local/resources/cosc4411/lecture02-search.pdf",
            title: "Lecture 02 — Search and uninformed strategies",
            type: "PDF",
            courseId: aiCourse.id,
            instructorUserId: instructor1.id,
            instructorProfileId: profileIns1.id,
            version: 2,
        },
        {
            fileUrl: "https://unilearn-seed.local/resources/cosc3312/normalization-slides.pptx",
            title: "Week 4 — Normalization (1NF–BCNF)",
            type: "PPT",
            courseId: dbCourse.id,
            instructorUserId: instructor1.id,
            instructorProfileId: profileIns1.id,
            version: 1,
        },
        {
            fileUrl: "https://unilearn-seed.local/resources/cosc3312/sql-lab.docx",
            title: "SQL practice lab worksheet",
            type: "DOC",
            courseId: dbCourse.id,
            instructorUserId: instructor1.id,
            instructorProfileId: profileIns1.id,
            version: 1,
        },
        {
            fileUrl: "https://unilearn-seed.local/resources/cosc2210/big-o-handout.pdf",
            title: "Big-O notation cheat sheet",
            type: "PDF",
            courseId: dsaCourse.id,
            instructorUserId: instructor1.id,
            instructorProfileId: profileIns1.id,
            version: 1,
        },
        {
            fileUrl: "https://unilearn-seed.local/resources/cosc2210/trees-avl.pptx",
            title: "Trees and AVL rotations",
            type: "PPT",
            courseId: dsaCourse.id,
            instructorUserId: instructor1.id,
            instructorProfileId: profileIns1.id,
            version: 1,
        },
        {
            fileUrl: "https://unilearn-seed.local/resources/seng3102/rest-api-notes.pdf",
            title: "REST API design checklist",
            type: "PDF",
            courseId: webCourse.id,
            instructorUserId: instructor2.id,
            instructorProfileId: profileIns2.id,
            version: 1,
        },
        {
            fileUrl: "https://unilearn-seed.local/resources/seng3102/react-intro.pptx",
            title: "React components and hooks intro",
            type: "PPT",
            courseId: webCourse.id,
            instructorUserId: instructor2.id,
            instructorProfileId: profileIns2.id,
            version: 1,
        },
        {
            fileUrl: "https://unilearn-seed.local/resources/seng3102/deployment.docx",
            title: "Deployment checklist (staging vs production)",
            type: "DOC",
            courseId: webCourse.id,
            instructorUserId: instructor2.id,
            instructorProfileId: profileIns2.id,
            version: 1,
        },
    ];

    const resources: Awaited<ReturnType<typeof prisma.resource.upsert>>[] = [];
    for (const r of resourceSeeds) {
        const res = await prisma.resource.upsert({
            where: { fileUrl: r.fileUrl },
            update: {
                title: r.title,
                type: r.type,
                courseId: r.courseId,
                instructorId: r.instructorUserId,
                instructorProfileId: r.instructorProfileId,
                version: r.version,
            },
            create: {
                title: r.title,
                type: r.type,
                fileUrl: r.fileUrl,
                courseId: r.courseId,
                instructorId: r.instructorUserId,
                instructorProfileId: r.instructorProfileId,
                version: r.version,
            },
        });
        resources.push(res);
    }

    const firstResource = resources[0]!;

    await prisma.resourceChunk.upsert({
        where: {
            resourceId_chunkIndex: {
                resourceId: firstResource.id,
                chunkIndex: 0,
            },
        },
        update: {
            pageNumber: 1,
            content: "Artificial Intelligence introduces systems that reason and learn from data.",
            tokenCount: 13,
            embedding: [],
        },
        create: {
            resourceId: firstResource.id,
            chunkIndex: 0,
            pageNumber: 1,
            content: "Artificial Intelligence introduces systems that reason and learn from data.",
            tokenCount: 13,
            embedding: [],
        },
    });

    await prisma.summary.upsert({
        where: { id: "00000000-0000-4000-8000-000000000001" },
        update: { content: "Updated: overview of course policies and grading." },
        create: {
            id: "00000000-0000-4000-8000-000000000001",
            content: "Summary: this course covers search, knowledge representation, and ML basics with weekly labs.",
            resourceId: firstResource.id,
            studnetId: student1.id,
        },
    });

    const quiz1 = await prisma.quiz.upsert({
        where: { id: "00000000-0000-4000-8000-000000000002" },
        update: {},
        create: {
            id: "00000000-0000-4000-8000-000000000002",
            title: "Quiz — Intro to AI",
            difficulty: "MEDIUM",
            resourceId: firstResource.id,
            studnetId: student1.id,
        },
    });

    await prisma.question.upsert({
        where: { id: "00000000-0000-4000-8000-000000000003" },
        update: {},
        create: {
            id: "00000000-0000-4000-8000-000000000003",
            content: "What is the primary goal of a rational agent?",
            options: { A: "Maximize performance measure", B: "Minimize lines of code", C: "Avoid all uncertainty", D: "Use only symbolic logic" },
            correctAns: "A",
            quizId: quiz1.id,
        },
    });

    await prisma.question.upsert({
        where: { id: "00000000-0000-4000-8000-000000000004" },
        update: {},
        create: {
            id: "00000000-0000-4000-8000-000000000004",
            content: "Which algorithm is uninformed?",
            options: { A: "A*", B: "BFS", C: "IDA*", D: "Greedy best-first with heuristic" },
            correctAns: "B",
            quizId: quiz1.id,
        },
    });

    await prisma.quizAttempt.upsert({
        where: { id: "00000000-0000-4000-8000-000000000005" },
        update: { score: 85 },
        create: {
            id: "00000000-0000-4000-8000-000000000005",
            score: 85,
            quizId: quiz1.id,
            studnetId: student1.id,
        },
    });

    await prisma.progress.upsert({
        where: {
            studnetId_courseId: {
                studnetId: student1.id,
                courseId: aiCourse.id,
            },
        },
        update: { resourceViewed: 5, averageScore: 82.5 },
        create: {
            id: "00000000-0000-4000-8000-000000000006",
            resourceViewed: 5,
            averageScore: 82.5,
            studnetId: student1.id,
            courseId: aiCourse.id,
        },
    });

    await prisma.progress.upsert({
        where: {
            studnetId_courseId: {
                studnetId: student1.id,
                courseId: dbCourse.id,
            },
        },
        update: { resourceViewed: 2, averageScore: 74 },
        create: {
            id: "00000000-0000-4000-8000-000000000007",
            resourceViewed: 2,
            averageScore: 74,
            studnetId: student1.id,
            courseId: dbCourse.id,
        },
    });

    console.log("\n======== UniLearn seed complete ========");
    console.log(`All demo accounts use password: ${DEMO_PASSWORD}`);
    console.log("Students (@uni.test):");
    console.log(`  - ${student1.email} (${student1.name})`);
    console.log(`  - ${student2.email} (${student2.name})`);
    console.log(`  - ${student3.email} (${student3.name})`);
    console.log("Students (@aau.edu.et — mobile dev):");
    console.log(`  - ${mobileStudent.email} (${mobileStudent.name})`);
    console.log(`  - ${aauStudent.email} (${aauStudent.name})`);
    console.log("Instructors:");
    console.log(`  - ${instructor1.email} (${instructor1.name})`);
    console.log(`  - ${instructor2.email} (${instructor2.name})`);
    console.log("Admin:");
    console.log(`  - ${admin.email} (${admin.name})`);
    // Re-seed cleanup: move any legacy rows off non–CS departments, then remove extra departments.
    const otherDepts = await prisma.department.findMany({
        where: { NOT: { id: deptCS.id } },
    });
    for (const d of otherDepts) {
        await prisma.studentProfile.updateMany({
            where: { departmentId: d.id },
            data: { departmentId: deptCS.id },
        });
        await prisma.instructorProfile.updateMany({
            where: { departmentId: d.id },
            data: { departmentId: deptCS.id },
        });
        await prisma.course.updateMany({
            where: { departmentId: d.id },
            data: { departmentId: deptCS.id },
        });
        await prisma.department.delete({ where: { id: d.id } });
    }

    console.log(
        `\nCounts: ${await prisma.department.count()} department (CS only), ${await prisma.user.count()} users, ${await prisma.course.count()} courses, ${await prisma.resource.count()} resources, ${await prisma.resourceChunk.count()} chunks.`
    );
    console.log(
        "AI (ask / summary / quiz): run ingest on a PDF resource so chunks get 768-dim embeddings and embedding_vec."
    );
    console.log("========================================\n");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
