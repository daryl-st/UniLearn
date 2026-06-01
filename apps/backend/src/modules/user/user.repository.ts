import type { Role } from "@unilearn/shared-types";
import type { Student as StudentType, Instructor as InstructorType } from "@unilearn/shared-types";
import prisma from "../../config/db.js";
import { User, Student, Instructor } from "./user.entity.js";
import type { Department } from "@prisma/client";

// i need to fix the database before fixing this.
export class UserRepository {
    async findAll(): Promise<User[]> {
        const users = await prisma.user.findMany();
        return users.map((u) =>
            new User({
                id: u.id,
                name: u.name,
                email: u.email,
                password: u.password,
                role: u.role,
                mustChangePassword: u.mustChangePassword,
                isVerified: u.isVerified,
                createdAt: u.createdAt,
                updatedAt: u.updatedAt,
            }),
        );
    }

    async create(data: {
        email: string;
        name: string;
        password: string;
        role: Role;
        isVerified?: boolean;
        verificationToken?: string | null;
    }): Promise<User> {
        const user = await prisma.user.create({ data });
        return new User({
            id: user.id,
            name: user.name,
            email: user.email,
            password: user.password,
            role: user.role,
            mustChangePassword: user.mustChangePassword,
            isVerified: user.isVerified,
            verificationToken: user.verificationToken ?? undefined,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        });
    }

    // create refresh token 
    async createRefreshToken(data: {tokenHash: string, userId: string, expiredAt: Date}) {
        await prisma.refreshToken.create({ data });
    }

    // Needs refactoring
    async createStudentProfile(data: {studentId: string, year: number}, id: string, departmentId: Department): Promise<Student> {
        const userProfile = await prisma.studentProfile.create({ 
            data: {
                id: id,
                studnetId: data.studentId,
                departmentId: departmentId.id,
                acadamicYear: data.year
            }
        });

        // I can get the remaining user data from the user table using the id.
        const user = await prisma.user.findUnique({ where: { id: id } });
        if (!user) throw new Error("User not found"); // temporary, we should handle this properly later.

        const studentData: StudentType = {
            id: user.id,
            name: user.name,
            email: user.email,
            password: user.password,
            role: user.role,
            studentId: userProfile.studnetId,
            departmentId: userProfile.departmentId,
            academicYear: userProfile.acadamicYear
        };

        // This would return full studnet data, including the user data and the student profile data.
        return new Student(studentData);
    }

    async createInstructorProfile(data: {instructorId: string}, id: string, departmentId?: Department): Promise<Instructor> {
        if (!departmentId) throw new Error("Invalid Department"); // temporary
        const userProfile = await prisma.instructorProfile.create({
            data: {
                id: id,
                instructorId: data.instructorId,
                departmentId: departmentId.id
            }
        });

        const user = await prisma.user.findUnique({ where: { id: id } });
        if (!user) throw new Error("User not found"); // temporary, we should handle this properly later.

         const instructorData: InstructorType = {
            id: user.id,
            name: user.name,
            email: user.email,
            password: user.password,
            role: user.role,
            instructorId: userProfile.instructorId
        };

        return new Instructor(instructorData);
    }

    async findUserByEmail(email: string): Promise<User | null> {
        const existingUser = await prisma.user.findFirst({
            where: { email: { equals: email.trim(), mode: "insensitive" } },
        });

        if (!existingUser) return null;

        return new User({
            id: existingUser.id,
            name: existingUser.name,
            email: existingUser.email,
            password: existingUser.password,
            role: existingUser.role,
            mustChangePassword: existingUser.mustChangePassword,
            isVerified: existingUser.isVerified,
            verificationToken: existingUser.verificationToken ?? undefined,
        });
    }

    async findUserById(id: string): Promise<User | null> {
        const existingUser = await prisma.user.findUnique({
            where: { id: id }
        });

        if (!existingUser) return null;

        return new User({
            id: existingUser.id,
            name: existingUser.name,
            email: existingUser.email,
            password: existingUser.password,
            role: existingUser.role,
            mustChangePassword: existingUser.mustChangePassword,
            isVerified: existingUser.isVerified,
            verificationToken: existingUser.verificationToken ?? undefined,
            createdAt: existingUser.createdAt,
            updatedAt: existingUser.updatedAt,
        });
    }

    async getUserNameById(id: string): Promise<string> {
        const existingUser = await prisma.user.findUnique({
            where: { id: id }
        });

        if (!existingUser) return 'Not Found!';

        return existingUser.name; // return null if not found
    }

    async countAllUsers(): Promise<number> {
        return prisma.user.count();
    }

    async countStudents(): Promise<number> {
        return prisma.studentProfile.count();
    }

    async countInstructors(): Promise<number> {
        return prisma.instructorProfile.count();
    }

    async findUserByVerificationToken(token: string): Promise<User | null> {
        const existingUser = await prisma.user.findFirst({
            where: { verificationToken: token },
        });

        if (!existingUser) return null;

        return new User({
            id: existingUser.id,
            name: existingUser.name,
            email: existingUser.email,
            password: existingUser.password,
            role: existingUser.role,
            mustChangePassword: existingUser.mustChangePassword,
            isVerified: existingUser.isVerified,
            verificationToken: existingUser.verificationToken ?? undefined,
            createdAt: existingUser.createdAt,
            updatedAt: existingUser.updatedAt,
        });
    }

    async update(id: string, data: { name: string; email: string; role: Role }): Promise<User> {
        const updatedUser = await prisma.user.update({
            where: { id },
            data: {
                name: data.name,
                email: data.email,
                role: data.role,
            },
        });

        return new User({
            id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
            password: updatedUser.password,
            role: updatedUser.role,
            mustChangePassword: updatedUser.mustChangePassword,
            isVerified: updatedUser.isVerified,
            verificationToken: updatedUser.verificationToken ?? undefined,
            createdAt: updatedUser.createdAt,
            updatedAt: updatedUser.updatedAt,
        });
    }

    async delete(id: string): Promise<User> {
        const deletedUser = await prisma.user.delete({
            where: { id },
        });

        return new User({
            id: deletedUser.id,
            name: deletedUser.name,
            email: deletedUser.email,
            password: deletedUser.password,
            role: deletedUser.role,
            mustChangePassword: deletedUser.mustChangePassword,
            isVerified: deletedUser.isVerified,
            verificationToken: deletedUser.verificationToken ?? undefined,
            createdAt: deletedUser.createdAt,
            updatedAt: deletedUser.updatedAt,
        });
    }
}