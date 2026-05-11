import type { UserRepository } from "../user/user.repository.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../../config/db.js";
import { generateAccessToken, generateRefreshToken } from "./auth.tokens.js";

const REFRESH_TTL_MS = 30 * 24 * 60 * 60 * 1000;

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

    /** Public self-registration: always STUDENT regardless of body role (instructor/admin via admin only). */
    async registerUser(data: { email: string; firstName: string; lastName: string; password: string }) {
        const existingUser = await this.userRepository.findUserByEmail(data.email);
        if (existingUser) throw new Error("Email already registered!");

        const hashedPass = await bcrypt.hash(data.password, 10);

        const user = await this.userRepository.create({
            email: data.email,
            name: `${data.firstName} ${data.lastName}`,
            role: "STUDENT",
            password: hashedPass,
        });

        const { accessToken, refreshToken } = await this.issueSession(user.id, user.role);

        return { user, accessToken, refreshToken };
    }

    async loginUser(data: { email: string; password: string }) {
        const existingUser = await this.userRepository.findUserByEmail(data.email);
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

        const department = await prisma.department.findUnique({ where: { code: "CS101" } });
        if (!department) throw new Error("Invalid Department");

        const userProfile = await this.userRepository.createStudentProfile(data, existing.id, department);

        return userProfile;
    }

    async createInstructorProfile(data: { instructorId: string }, email: string) {
        const existing = await this.userRepository.findUserByEmail(email);
        if (!existing) throw new Error("Internal Error!");

        const department = await prisma.department.findUnique({ where: { code: "CS101" } });
        if (!department) throw new Error("Invalid Department");

        const instructorProfile = await this.userRepository.createInstructorProfile(data, existing.id, department);

        return instructorProfile;
    }
}
