import type { Role } from "@unilearn/shared-types";
import type { Student as StudentType, Instructor as InstructorType } from "@unilearn/shared-types";
import prisma from "../../config/db.js";
// import { User, StudentProfile, InstructorProfile } from "./user.entity.js";
import { User, Student, Instructor } from "./user.entity.js";
import type { Department } from "@prisma/client";

// i need to fix the database before fixing this.
export class UserRepository {
    async findAll(): Promise<User[]> {
        const users = await prisma.user.findMany();
        return users.map(u => new User({id: u.id, name: u.name, email: u.email, password: u.password, role: u.role})); // username is not included
    }

    async create(data: {email: string, name: string, password: string, role: Role}): Promise<User> {
        const user = await prisma.user.create({ data }); // we need to trim and toLowerCase when storing data
        // we might need to have a discussion about returning the password or not, but for now let's return it as it is.
        return new User({id: user.id, name: user.name, email: user.email, password: user.password, role: user.role});
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
        const existingUser = await prisma.user.findUnique({
            where: { email: email }
        });

        if (!existingUser) return null;

        return new User({
            id: existingUser.id, 
            name: existingUser.name, 
            email: existingUser.email, 
            password: existingUser.password, 
            role: existingUser.role
        }); // return null if not found
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
            role: existingUser.role
        }); // return null if not found
    }

    async getUserNameById(id: string): Promise<string> {
        const existingUser = await prisma.user.findUnique({
            where: { id: id }
        });

        if (!existingUser) return 'Not Found!';

        return existingUser.name; // return null if not found
    }
}