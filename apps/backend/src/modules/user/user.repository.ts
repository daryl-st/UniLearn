import type { Role } from "@unilearn/shared-types";
import prisma from "../../config/db.js";
import { User } from "./user.entity.js";

export class UserRepository {
    async findAll(): Promise<User[]> {
        const users = await prisma.user.findMany();
        return users.map(u => new User(u.id, u.email, u.firstName, u.lastName, u.role)); // username is not included
    }

    async create(data: {email: string, firstName: string, lastName: string, passwordHash: string, role: Role}): Promise<User> {
        const user = await prisma.user.create({ data }); // somehow we go the types check from shared-type
        return new User(user.id, user.email, user.firstName, user.lastName, user.role);
    }
}