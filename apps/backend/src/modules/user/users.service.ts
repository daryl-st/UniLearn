import type { Role } from "@unilearn/shared-types";
import { UserRepository } from "./user.repository.js"
import prisma from "../../config/db.js";
import { User } from "./user.entity.js";
import {
    isAauInstructorEmail,
    normalizeInstructorEmail,
    AAU_INSTRUCTOR_EMAIL_ERROR,
} from "../Auth/aauEmail.js";

export class UserService {
    constructor(private userRepository: UserRepository) {}

    async getUsers() {
        return this.userRepository.findAll();
    }

    async updateUser(id: string, data: { name: string; email: string; role: Role }) {
        const user = await this.userRepository.findUserById(id);
        if (!user) {
            throw new Error("User not found");
        }

        const normalizedEmail = data.email.trim().toLowerCase();
        if (normalizedEmail !== user.email.toLowerCase()) {
            const existing = await this.userRepository.findUserByEmail(normalizedEmail);
            if (existing) {
                throw new Error("Email already registered!");
            }
        }

        return this.userRepository.update(id, {
            name: data.name.trim(),
            email: normalizedEmail,
            role: data.role,
        });
    }

    async deleteUser(id: string) {
        const user = await this.userRepository.findUserById(id);
        if (!user) {
            throw new Error("User not found");
        }

        if (user.role === "ADMIN") {
            throw new Error("Cannot delete an admin user");
        }

        return this.userRepository.delete(id);
    }

    // This should be admin functionality, but for now let's keep it simple.
    // Admins can create instructors and students.
    async createUser(data: {email: string, name: string, password: string, role: Role}) {
        // check if user exists and other business logic
        return this.userRepository.create(data);
    }

    async createAdminUser(data: {
        email: string;
        name: string;
        role: Role;
        password: string;
        courseIds?: string[];
    }) {
        let normalizedEmail = data.email;
        if (data.role === "INSTRUCTOR") {
            normalizedEmail = normalizeInstructorEmail(data.email);
            if (!isAauInstructorEmail(normalizedEmail)) {
                throw new Error(AAU_INSTRUCTOR_EMAIL_ERROR);
            }
        }

        const existing = await this.userRepository.findUserByEmail(normalizedEmail);
        if (existing) {
            throw new Error("Email already registered!");
        }

        const bcrypt = await import("bcrypt");
        const hashedPassword = await bcrypt.default.hash(data.password, 10);

        const user = await prisma.$transaction(async (tx) => {
            const createdUser = await tx.user.create({
                data: {
                    email: normalizedEmail,
                    name: data.name,
                    role: data.role,
                    password: hashedPassword,
                    mustChangePassword: true,
                    isVerified: true,
                    verificationToken: null,
                },
            });

            if (data.role === "INSTRUCTOR") {
                const instructorIdCode = `INS/${createdUser.id.replace(/-/g, "").slice(0, 8).toUpperCase()}`;
                
                const department = await tx.department.findUnique({
                    where: { code: "CS101" },
                });
                if (!department) {
                    throw new Error("Default department CS101 not found. Run seed first.");
                }

                await tx.instructorProfile.create({
                    data: {
                        id: createdUser.id,
                        instructorId: instructorIdCode,
                        departmentId: department.id,
                    },
                });

                if (data.courseIds && data.courseIds.length > 0) {
                    await tx.course.updateMany({
                        where: {
                            id: { in: data.courseIds },
                        },
                        data: {
                            instructorId: createdUser.id,
                        },
                    });
                }
            } else if (data.role === "STUDENT") {
                const studentIdCode = `UGR/${createdUser.id.replace(/-/g, "").slice(0, 8).toUpperCase()}`;
                const department = await tx.department.findUnique({
                    where: { code: "CS101" },
                });
                if (!department) {
                    throw new Error("Default department CS101 not found. Run seed first.");
                }

                await tx.studentProfile.create({
                    data: {
                        id: createdUser.id,
                        studnetId: studentIdCode,
                        departmentId: department.id,
                        acadamicYear: 1,
                    },
                });
            }

            return createdUser;
        });

        return new User({
            id: user.id,
            name: user.name,
            email: user.email,
            password: user.password,
            role: user.role,
            mustChangePassword: user.mustChangePassword,
            isVerified: user.isVerified,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        });
    }
}

// What is service’s role?
// Service is where use cases live.

// Like:
// • registerUser
// • enrollUserInCourse
// • generateCertificate
// • assignRoleToUser