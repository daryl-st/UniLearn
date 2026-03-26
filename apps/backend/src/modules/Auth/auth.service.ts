import type { Role } from "@unilearn/shared-types";
import type { UserRepository } from "../user/user.repository.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../../config/db.js";
import { generateAccessToken, generateRefreshToken } from "./auth.tokens.js";

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN as string;

export class AuthService {
    constructor(private userRepository: UserRepository) {}

    async registerUser(data: {email: string, firstName: string, lastName: string, password: string}) {
        const existingUser = await this.userRepository.findUserByEmail(data.email);
        if (existingUser) throw new Error("Email already registered!");

        const hashedPass = await bcrypt.hash(data.password, 10);

        const user = await this.userRepository.create({
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            role: "STUDENT", // needs to be changed
            passwordHash: hashedPass
        });

        const token = jwt.sign(
            { userId: user.id, role: user.role },
            JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN,
        } as jwt.SignOptions);

        return { user, token };
    };

    async loginUser(data: { email: string, password: string }) {
        // centralize error handling using separate AppError class 
        const existingUser = await this.userRepository.findUserByEmail(data.email);
        if (!existingUser) throw new Error("User not found!"); // return 500 that don't say much

        const isPassValid = await bcrypt.compare(data.password, existingUser.password);
        if (!isPassValid) throw new Error("Invalid email or password!");

        const accessToken = generateAccessToken(existingUser.id, existingUser.role);
        const refreshToken = generateRefreshToken(existingUser.id);

        const tokenHash = await bcrypt.hash(refreshToken, 10);

        this.userRepository.createRefreshToken({
            tokenHash, userId: existingUser.id, expiredAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        });

        const token = jwt.sign(
            { userId: existingUser.id, role: existingUser.role }, 
            JWT_SECRET, 
            { expiresIn: JWT_EXPIRES_IN, } as jwt.SignOptions);

        return { existingUser, token, accessToken, refreshToken };
    };

    async refresh(refreshToken: any) {
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

        await prisma.refreshToken.update( {
            where: { id: matchedToken.id },
            data: { revoked: true }
        });

        const newRefreshToken = generateRefreshToken(payload.sub);
        const newHash = await bcrypt.hash(newRefreshToken, 10);

        await prisma.refreshToken.create({
            data: {
                userId: payload.sub,
                tokenHash: newHash,
                expiredAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            }
        });

        const newAccessToken = generateAccessToken(payload.sub, "student");

        return { newRefreshToken, newAccessToken };
    }

    async logout(refreshToken: any) {
        const tokens = await prisma.refreshToken.findMany();

        for (const token of tokens) {
            const match = await bcrypt.compare(refreshToken, token.tokenHash);

            if (match) {
                await prisma.refreshToken.update({
                    where: {id: token.id},
                    data: { revoked: true }
                })
            }
        }
    }

    // Needs refactoring
    async createStudentProfile(data: { studentId: string, year: number}, email: string) {
        const existing = await this.userRepository.findUserByEmail(email);
        if (!existing) throw new Error("Internal Error!");

        // temporary
        const department = await prisma.department.findUnique({ where: {code: "CS101"}});
        if (!department) throw new Error("Invalid Department");

        const userProfile = await this.userRepository.createStudentProfile(data, existing.id, department);

        return userProfile;
    }

    async createInstructorProfile(data: { instructorId: string }, email: string) {
        const existing = await this.userRepository.findUserByEmail(email);
        if (!existing) throw new Error("Internal Error!");

        // temporary
        const department = await prisma.department.findUnique({ where: {code: "CS101"}});
        if (!department) throw new Error("Invalid Department");

        const instructorProfile = await this.userRepository.createInstructorProfile(data, existing.id, department);

        return instructorProfile;
    }
}