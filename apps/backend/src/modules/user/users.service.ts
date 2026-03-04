import prisma from "../config/db.js";
// import type { User } from "@unilearn/shared-types"; Import types as such

export const getAllUsers = async () => {
    const users = prisma.user.findMany();

    return users;
}