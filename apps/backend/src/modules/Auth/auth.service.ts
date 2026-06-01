import { randomBytes } from "node:crypto";
import type { UserRepository } from "../user/user.repository.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../../config/db.js";
import { generateAccessToken, generateRefreshToken } from "./auth.tokens.js";
import {
    sendVerificationEmail,
    EmailServiceNotConfiguredError,
    EmailServiceDeliveryError,
} from "../../services/email.service.js";
import {
    AAU_STUDENT_EMAIL_ERROR,
    isAauStudentEmail,
    normalizeLoginEmail,
    normalizeStudentEmail,
} from "./aauEmail.js";

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

    /** Public self-registration: AAU email + Brevo verification before account activation. */
    async registerUser(data: { email: string; firstName: string; lastName: string; password: string }) {
        const email = normalizeStudentEmail(data.email);
        if (!isAauStudentEmail(email)) {
            throw new Error(AAU_STUDENT_EMAIL_ERROR);
        }

        const existingUser = await this.userRepository.findUserByEmail(email);
        if (existingUser) throw new Error("Email already registered!");

        const hashedPass = await bcrypt.hash(data.password, 10);
        const token = randomBytes(32).toString("hex");
        const name = `${data.firstName.trim()} ${data.lastName.trim()}`.trim();

        await this.userRepository.create({
            email,
            name,
            role: "STUDENT",
            password: hashedPass,
            isVerified: false,
            verificationToken: token,
        });

        const clientOrigin =
            process.env.CLIENT_ORIGIN?.split(",")[0]?.trim() ?? "http://localhost:5173";
        const verifyUrl = `${clientOrigin.replace(/\/$/, "")}/verify-email?token=${encodeURIComponent(token)}`;

        const emailSent = await this.deliverVerificationEmail(email, verifyUrl);

        return {
            message: emailSent
                ? "Verification email sent. Please check your inbox."
                : "Verification email could not be delivered. Please try again later.",
            email,
        };
    }

    private async deliverVerificationEmail(email: string, verifyUrl: string): Promise<boolean> {
        try {
            await sendVerificationEmail(email, verifyUrl);
            return true;
        } catch (err) {
            if (err instanceof EmailServiceNotConfiguredError) {
                throw err;
            }
            if (err instanceof EmailServiceDeliveryError) {
                throw err;
            }
            console.error("[AuthService] Email delivery error", err);
            throw new EmailServiceDeliveryError(
                err instanceof Error ? err.message : "Failed to send verification email.",
            );
        }
    }

    async verifyEmail(token: string) {
        const trimmed = token?.trim();
        if (!trimmed) throw new Error("Invalid verification token");

        const existingUser = await this.userRepository.findUserByVerificationToken(trimmed);
        if (!existingUser) throw new Error("Invalid or expired verification link");
        if (existingUser.isVerified) {
            return { message: "Your account is already verified. You can now sign in." };
        }

        await prisma.user.update({
            where: { id: existingUser.id },
            data: {
                isVerified: true,
                verificationToken: null,
            },
        });

        return { message: "Email verified successfully. You can now sign in." };
    }

    async loginUser(data: { email: string; password: string }) {
        const email = normalizeLoginEmail(data.email);
        const existingUser = await this.userRepository.findUserByEmail(email);
        if (!existingUser) throw new Error("User not found!");

        const isPassValid = await bcrypt.compare(data.password, existingUser.password);
        if (!isPassValid) throw new Error("Invalid email or password!");

        if (existingUser.isVerified === false) {
            throw new Error("Please verify your email before logging in.");
        }

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

export { EmailServiceNotConfiguredError, EmailServiceDeliveryError };
