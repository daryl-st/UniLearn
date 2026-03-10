import type { Role } from "@unilearn/shared-types";
import prisma from "../../config/db.js";
import { User, StudentProfile, InstructorProfile } from "./user.entity.js";
import type { Department } from "@prisma/client";

export class UserRepository {
    async findAll(): Promise<User[]> {
        const users = await prisma.user.findMany();
        return users.map(u => new User(u.id, u.email, u.passwordHash ,u.firstName, u.lastName, u.role)); // username is not included
    }

    async create(data: {email: string, firstName: string, lastName: string, passwordHash: string, role: Role}): Promise<User> {
        const user = await prisma.user.create({ data }); // we need to trim and toLowerCase when storing data
        return new User(user.id, user.email, user.passwordHash, user.firstName, user.lastName, user.role);
    }

    // create refresh token 
    async createRefreshToken(data: {tokenHash: string, userId: string, expiredAt: Date}) {
        await prisma.refreshToken.create({ data });
    }

    // Needs refactoring
    async createStudentProfile(data: {studentId: string, year: number}, id: string, departmentId: Department): Promise<StudentProfile> {
        const userProfile = await prisma.studentProfile.create({ 
            data: {
                id: id,
                studnetId: data.studentId,
                departmentId: departmentId.id,
                acadamicYear: data.year
            }
        });

        return new StudentProfile(userProfile.id, userProfile.studnetId, userProfile.departmentId, userProfile.acadamicYear);
    }

    async createInstructorProfile(data: {instructorId: string}, id: string, departmentId?: Department): Promise<InstructorProfile> {
        if (!departmentId) throw new Error("Invalid Department"); // temporary
        const userProfile = await prisma.instructorProfile.create({
            data: {
                id: id,
                instructorId: data.instructorId,
                departmentId: departmentId.id
            }
        });

        return new InstructorProfile(userProfile.id, userProfile.instructorId, userProfile.departmentId);
    }

    async findUserById(email: string): Promise<User | null> {
        const existingUser = await prisma.user.findUnique({
            where: { email: email }
        });

        if (!existingUser) return null;

        return new User(existingUser.id, existingUser?.email, existingUser.passwordHash, existingUser?.firstName, existingUser?.lastName, existingUser.role); // return null if not found
    }
}