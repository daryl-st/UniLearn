import type { Request, Response } from "express";
import { getAllUsers } from "../services/users.service.js";

export const getUsers = async (req: Request, res: Response) => {
    try {
        const userData = await getAllUsers();

        // if (userData.length == 0) throw new Error("No users found!");

        return res.status(200).json({
            success: true,
            data: userData
        })
    } catch (err) {
        console.log("Internal Server Error!")
        console.error(err);
    }
}
