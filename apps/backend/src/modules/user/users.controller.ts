import type { Request, Response } from "express";
import { UserService } from "./users.service.js";
import { UserRepository } from "./user.repository.js";

const userRepository = new UserRepository();
const userService = new UserService(userRepository);

export class UserController {
    async getUsers(_req: Request, res: Response) {
        const users = await userService.getUsers();
        // needs proper formatting, pagination and validation before sending the response.
        res.status(200).json(users.map((u) => u.toJson()));
    };

    // This is admin functionality. For now let's just create students only with hardcoded logic.
    async createUser(req: Request, res: Response) {
        try {
            const { email, name, role, courseIds } = req.body;
            if (!email || !name || !role) {
                return res.status(400).json({ error: "Email, name, and role are required." });
            }
            if (role !== "INSTRUCTOR" && role !== "STUDENT") {
                return res.status(400).json({ error: "Role must be INSTRUCTOR or STUDENT." });
            }

            const crypto = await import("crypto");
            const tempPassword = crypto.randomBytes(6).toString("hex");

            const user = await userService.createAdminUser({
                email,
                name,
                role,
                password: tempPassword,
                courseIds,
            });

            return res.status(201).json({
                user: user.toJson(),
                temporaryPassword: tempPassword,
            });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Failed to create user";
            const status = message === "Email already registered!" ? 409 : 500;
            return res.status(status).json({ error: message });
        }
    }
}
