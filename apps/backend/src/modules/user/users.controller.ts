import type { Request, Response } from "express";
import { UserService } from "./users.service.js";
import { UserRepository } from "./user.repository.js";
import { AAU_INSTRUCTOR_EMAIL_ERROR } from "../Auth/aauEmail.js";

const userRepository = new UserRepository();
const userService = new UserService(userRepository);

export class UserController {
    async getUsers(_req: Request, res: Response) {
        const users = await userService.getUsers();
        // needs proper formatting, pagination and validation before sending the response.
        res.status(200).json(users.map((u) => u.toJson()));
    };

    async updateUser(req: Request, res: Response) {
        try {
            const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const { email, name, role } = req.body;

            if (!id || !email || !name || !role) {
                return res.status(400).json({ error: "User id, email, name, and role are required." });
            }

            if (!["ADMIN", "INSTRUCTOR", "STUDENT"].includes(role)) {
                return res.status(400).json({ error: "Role must be ADMIN, INSTRUCTOR, or STUDENT." });
            }

            const user = await userService.updateUser(id, {
                email,
                name,
                role,
            });

            return res.status(200).json({ user: user.toJson() });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Failed to update user";
            const status = message === "User not found" ? 404 : message === "Email already registered!" ? 409 : 500;
            return res.status(status).json({ error: message });
        }
    }

    async deleteUser(req: Request, res: Response) {
        try {
            const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            if (!id) {
                return res.status(400).json({ error: "User id is required." });
            }

            await userService.deleteUser(id);
            return res.status(204).send();
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Failed to delete user";
            const status = message === "User not found" ? 404 : message === "Cannot delete an admin user" ? 400 : 500;
            return res.status(status).json({ error: message });
        }
    }

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
            const status = message === "Email already registered!" ? 409 : (message === AAU_INSTRUCTOR_EMAIL_ERROR ? 400 : 500);
            return res.status(status).json({ error: message });
        }
    }
}
