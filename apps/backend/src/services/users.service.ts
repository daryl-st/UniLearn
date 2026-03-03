import prisma from "../config/db.js";

export const getAllUsers = async () => {
    const users = prisma.user.findMany();

    return users;
}