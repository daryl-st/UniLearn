import type { UserRepository } from "../user/user.repository.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../../config/db.js";
import { generateAccessToken, generateRefreshToken } from "./auth.tokens.js";
import {
    AAU_STUDENT_EMAIL_ERROR,
    isAauStudentEmail,
    normalizeLoginEmail,
    normalizeStudentEmail,
} from "./aauEmail.js";
import type { User } from "../user/user.entity.js";

const REFRESH_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const DEFAULT_DEPARTMENT_CODE = "CS101";

export class AuthService {
    constructor(private userRepository: UserRepository) {}

    private async issueSession(userId: string, role: string): Promise<{ accessToken: string; refreshToken: string }> {
        const accessToken = generateAccessToken(userId, role);
        const refreshToken = generateRefreshToken(userId);
        const tokenHash = await bcrypt.hash(refreshToken, 10);
        await this.userRepository.createRefreshToken({
            tokenHash,
            userId,
            expiredAt: new Date(Date.now() + REFRESH_TTL_MS),
        });
        return { accessToken, refreshToken };
    }

    /** Public self-registration: AAU email, account active immediately (no email verification). */
    async registerUser(data: { email: string; firstName: string; lastName: string; password: string }) {
        const email = normalizeStudentEmail(data.email);
        if (!isAauStudentEmail(email)) {
            throw new Error(AAU_STUDENT_EMAIL_ERROR);
        }

        const hashedPass = await bcrypt.hash(data.password, 10);
        const name = `${data.firstName.trim()} ${data.lastName.trim()}`.trim();

        const existingUser = await this.userRepository.findUserByEmail(email);
        let user: User;

        if (existingUser) {
            if (existingUser.role !== "STUDENT") {
                throw new Error("Email already registered!");
            }
            await prisma.user.update({
                where: { id: existingUser.id },
                data: {
                    name,
                    password: hashedPass,
                    isVerified: true,
                    verificationToken: null,
                },
            });
            const updated = await this.userRepository.findUserById(existingUser.id);
            if (!updated) throw new Error("Internal Error!");
            user = updated;
        } else {
            user = await this.userRepository.create({
                email,
                name,
                role: "STUDENT",
                password: hashedPass,
                isVerified: true,
                verificationToken: null,
            });
        }

        const { accessToken, refreshToken } = await this.issueSession(user.id, user.role);

        return {
            message: "Account created successfully.",
            user,
            accessToken,
            refreshToken,
        };
    }

    async loginUser(data: { email: string; password: string }) {
        const email = normalizeLoginEmail(data.email);
        const existingUser = await this.userRepository.findUserByEmail(email);
        if (!existingUser) throw new Error("User not found!");

        const isPassValid = await bcrypt.compare(data.password, existingUser.password);
        if (!isPassValid) throw new Error("Invalid email or password!");

        const { accessToken, refreshToken } = await this.issueSession(existingUser.id, existingUser.role);

        return { existingUser, accessToken, refreshToken };
    }

    async refresh(refreshToken: string) {
        const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as { sub: string };

        const tokens = await prisma.refreshToken.findMany({
            where: { userId: payload.sub, revoked: false },
        });

        let matchedToken = null;

        for (const token of tokens) {
            const match = await bcrypt.compare(refreshToken, token.tokenHash);
            if (match) {
                matchedToken = token;
                break;
            }
        }

        if (!matchedToken) throw new Error("Invalid refresh token!");

        const user = await this.userRepository.findUserById(payload.sub);
        if (!user) throw new Error("Invalid refresh token!");

        await prisma.refreshToken.update({
            where: { id: matchedToken.id },
            data: { revoked: true },
        });

        const newRefreshToken = generateRefreshToken(payload.sub);
        const newHash = await bcrypt.hash(newRefreshToken, 10);

        await prisma.refreshToken.create({
            data: {
                userId: payload.sub,
                tokenHash: newHash,
                expiredAt: new Date(Date.now() + REFRESH_TTL_MS),
            },
        });

        const newAccessToken = generateAccessToken(payload.sub, user.role);

        return { newRefreshToken, newAccessToken };
    }

    async logout(refreshToken: string): Promise<void> {
        let payload: { sub: string };
        try {
            payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as { sub: string };
        } catch {
            return;
        }

        const tokens = await prisma.refreshToken.findMany({
            where: { userId: payload.sub, revoked: false },
        });

        for (const token of tokens) {
            const match = await bcrypt.compare(refreshToken, token.tokenHash);
            if (match) {
                await prisma.refreshToken.update({
                    where: { id: token.id },
                    data: { revoked: true },
                });
                return;
            }
        }
    }

    async createStudentProfile(data: { studentId: string; year: number }, email: string) {
        const existing = await this.userRepository.findUserByEmail(email);
        if (!existing) throw new Error("Internal Error!");

        const department = await prisma.department.findUnique({ where: { code: DEFAULT_DEPARTMENT_CODE } });
        if (!department) throw new Error("Run database seed first");

        return this.userRepository.createStudentProfile(
            { studentId: data.studentId, year: data.year },
            existing.id,
            department,
        );
    }

    async createInstructorProfile(data: { instructorId: string }, email: string) {
        const existing = await this.userRepository.findUserByEmail(email);
        if (!existing) throw new Error("Internal Error!");

        const department = await prisma.department.findUnique({ where: { code: DEFAULT_DEPARTMENT_CODE } });
        if (!department) throw new Error("Run database seed first");

        return this.userRepository.createInstructorProfile(data, existing.id, department);
    }

    async getMe(userId: string) {
        const user = await this.userRepository.findUserById(userId);
        if (!user) throw new Error("User not found!");

        const studentProfile = await prisma.studentProfile.findUnique({
            where: { id: userId },
            select: {
                studnetId: true,
                acadamicYear: true,
                departmentId: true,
            },
        });

        const progressRows = studentProfile
            ? await prisma.progress.findMany({
                  where: { studnetId: userId },
                  include: {
                      course: {
                          select: {
                              name: true,
                              code: true,
                              acadamicYear: true,
                          },
                      },
                  },
              })
            : [];

        return {
            user,
            studentProfile: studentProfile
                ? {
                      studnetId: studentProfile.studnetId,
                      acadamicYear: studentProfile.acadamicYear,
                      departmentId: studentProfile.departmentId,
                  }
                : null,
            courseProgress: progressRows.map((row) => ({
                courseId: row.courseId,
                resourceViewed: row.resourceViewed,
                averageScore: row.averageScore,
                course: {
                    name: row.course.name,
                    code: row.course.code,
                    acadamicYear: row.course.acadamicYear,
                },
            })),
        };
    }
}
