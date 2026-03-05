import type { Role } from "@unilearn/shared-types";
import prisma from "../../config/db.js";
import { User } from "./user.entity.js";

export class UserRepository {
    async findAll(): Promise<User[]> {
        const users = await prisma.user.findMany();
        return users.map(u => new User(u.id, u.email, u.passwordHash ,u.firstName, u.lastName, u.role)); // username is not included
    }

    async create(data: {email: string, firstName: string, lastName: string, passwordHash: string, role: Role}): Promise<User> {
        const user = await prisma.user.create({ data }); // somehow we go the types check from shared-type
        return new User(user.id, user.email, user.passwordHash, user.firstName, user.lastName, user.role);
    }

    async findUserById(email: string): Promise<User | null> {
        const existingUser = await prisma.user.findUnique({
            where: { email: email }
        });

        if (!existingUser) return null;

        return new User(existingUser.id, existingUser?.email, existingUser.passwordHash, existingUser?.firstName, existingUser?.lastName, existingUser.role); // return null if not found
    }
}