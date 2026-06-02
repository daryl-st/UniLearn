import bcrypt from "bcrypt";
import type { Express } from "express";
import type { Role } from "@prisma/client";
import request, { type TestAgent } from "supertest";

import app from "../../src/app.js";
import prisma from "../../src/config/db.js";
import { makeAccessToken } from "./jwt.js";

export function integrationApp(): Express {
    if (!process.env.ACCESS_TOKEN_SECRET) {
        process.env.ACCESS_TOKEN_SECRET = "integration-access-secret";
    }
    if (!process.env.REFRESH_TOKEN_SECRET) {
        process.env.REFRESH_TOKEN_SECRET = "integration-refresh-secret";
    }
    return app;
}

export function api() {
    return request(integrationApp());
}

export function createAgent(): TestAgent {
    return request.agent(integrationApp());
}

export async function loginWithCookies(
    email: string,
    password: string,
    agent: TestAgent = createAgent(),
) {
    const res = await agent.post("/auth/login").send({ email, password });
    return { agent, res };
}

/** Parse refreshToken value from Set-Cookie header(s) after login/refresh. */
export function extractRefreshCookie(
    setCookie: string | string[] | undefined,
): string | undefined {
    if (!setCookie) return undefined;
    const cookies = Array.isArray(setCookie) ? setCookie : [setCookie];
    for (const entry of cookies) {
        const match = entry.match(/^refreshToken=([^;]+)/);
        if (match?.[1]) return match[1];
    }
    return undefined;
}

export async function resetDatabase(): Promise<void> {
    await prisma.quizAttempt.deleteMany();
    await prisma.question.deleteMany();
    await prisma.quiz.deleteMany();
    await prisma.chatMessage.deleteMany();
    await prisma.chatThread.deleteMany();
    await prisma.summary.deleteMany();
    await prisma.progress.deleteMany();
    await prisma.resourceChunk.deleteMany();
    await prisma.resource.deleteMany();
    await prisma.courseInstructor.deleteMany();
    await prisma.course.deleteMany();
    await prisma.refreshToken.deleteMany();
    await prisma.studentProfile.deleteMany();
    await prisma.instructorProfile.deleteMany();
    await prisma.user.deleteMany();
    await prisma.department.deleteMany();
}

export async function seedDepartment(code = "CS101") {
    return prisma.department.upsert({
        where: { code },
        update: {
            name: "Computer Science",
        },
        create: {
            name: "Computer Science",
            code,
        },
    });
}

export async function seedUser(params: {
    email: string;
    name: string;
    role: Role;
    password?: string;
    isVerified?: boolean;
    verificationToken?: string | null;
}) {
    const passwordHash = await bcrypt.hash(params.password ?? "password123", 10);
    return prisma.user.create({
        data: {
            email: params.email,
            name: params.name,
            role: params.role,
            password: passwordHash,
            isVerified: params.isVerified ?? true,
            verificationToken: params.verificationToken ?? null,
        },
    });
}

export async function seedStudentProfile(userId: string, departmentId: string) {
    return prisma.studentProfile.create({
        data: {
            id: userId,
            studnetId: `UGR/${userId.slice(0, 8).toUpperCase()}`,
            acadamicYear: 2,
            departmentId,
        },
    });
}

export async function seedInstructorProfile(userId: string, departmentId: string) {
    return prisma.instructorProfile.create({
        data: {
            id: userId,
            instructorId: `INS/${userId.slice(0, 8).toUpperCase()}`,
            departmentId,
        },
    });
}

export async function seedCourse(params: {
    departmentId: string;
    instructorProfileId?: string;
    code?: string;
    name?: string;
}) {
    return prisma.course.create({
        data: {
            name: params.name ?? "Algorithms",
            code: params.code ?? `COSC-${Math.floor(Math.random() * 100000)}`,
            acadamicYear: 2,
            departmentId: params.departmentId,
            instructorId: params.instructorProfileId ?? null,
        },
    });
}

export async function assignInstructor(courseId: string, instructorUserId: string) {
    return prisma.courseInstructor.create({
        data: {
            courseId,
            instructorId: instructorUserId,
        },
    });
}

export async function seedUnverifiedStudent(params: {
    email: string;
    name?: string;
    password?: string;
    verificationToken: string;
    departmentCode?: string;
}) {
    const dept = await seedDepartment(params.departmentCode ?? "CS101");
    const user = await seedUser({
        email: params.email,
        name: params.name ?? "Unverified Student",
        role: "STUDENT",
        password: params.password ?? "password123",
        isVerified: false,
        verificationToken: params.verificationToken,
    });
    await seedStudentProfile(user.id, dept.id);
    return { user, dept };
}

export async function seedProgress(studentUserId: string, courseId: string) {
    return prisma.progress.create({
        data: {
            studnetId: studentUserId,
            courseId,
            resourceViewed: 1,
            averageScore: 75,
        },
    });
}

export async function seedCloudinaryResource(params: {
    courseId: string;
    instructorUserId: string;
    title?: string;
}) {
    const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    return prisma.resource.create({
        data: {
            title: params.title ?? `Resource-${unique}`,
            type: "PDF",
            fileUrl: `https://res.cloudinary.com/demo/raw/upload/v1/unilearn/resources/${unique}.pdf`,
            courseId: params.courseId,
            instructorId: params.instructorUserId,
            version: 1,
            status: "READY",
        },
    });
}

export function bearer(userId: string, role: Role): string {
    return `Bearer ${makeAccessToken(userId, role)}`;
}
