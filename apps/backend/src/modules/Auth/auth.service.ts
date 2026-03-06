import type { Role, User } from "@unilearn/shared-types";
import type { UserRepository } from "../user/user.repository.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../../config/db.js";

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN as string;

export class AuthService {
    constructor(private userRepository: UserRepository) {}

    async registerUser(data: {email: string, firstName: string, lastName: string, passwordHash: string, role: Role}) {
        const existingUser = await this.userRepository.findUserById(data.email);
        if (existingUser) throw new Error("Email already registered!");

        const hashedPass = await bcrypt.hash(data.passwordHash, 10);

        const user = await this.userRepository.create({
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            role: data.role,
            passwordHash: hashedPass
        });

        const token = jwt.sign(
            { userId: user.id, role: user.role },
            JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN,
        } as jwt.SignOptions);

        return { user, token };
    };

    async loginUser(data: { email: string, passwordHash: string }) {
        const existingUser = await this.userRepository.findUserById(data.email);
        if (!existingUser) throw new Error("User not found!");

        const isPassValid = await bcrypt.compare(data.passwordHash, existingUser.password);
        if (!isPassValid) throw new Error("Invalid email or password!");

        const token = jwt.sign(
            { userId: existingUser.id, role: existingUser.role }, 
            JWT_SECRET, 
            { expiresIn: JWT_EXPIRES_IN, } as jwt.SignOptions);

        return { existingUser, token };
    };

    // Needs refactoring
    async createStudentProfile(data: { studentId: string, year: number}, email: string) {
        const existing = await this.userRepository.findUserById(email);
        if (!existing) throw new Error("Internal Error!");

        // temporary
        const department = await prisma.department.findUnique({ where: {code: "CS101"}});
        if (!department) throw new Error("Invalid Department");

        const userProfile = await this.userRepository.createStudentProfile(data, existing.id, department);

        return userProfile;
    }

    async createInstructorProfile(data: { instructorId: string }, email: string) {
        const existing = await this.userRepository.findUserById(email);
        if (!existing) throw new Error("Internal Error!");

        // temporary
        const department = await prisma.department.findUnique({ where: {code: "CS101"}});
        if (!department) throw new Error("Invalid Department");

        const instructorProfile = await this.userRepository.createInstructorProfile(data, existing.id, department);

        return instructorProfile;
    }
}