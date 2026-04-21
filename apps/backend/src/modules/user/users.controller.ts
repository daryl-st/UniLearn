import type { Request, Response } from "express";
import { UserService } from "./users.service.js";
import { UserRepository } from "./user.repository.js";
import type { CreateUserInputRegister } from "@unilearn/shared-types";

const userRepository = new UserRepository();
const userService = new UserService(userRepository);

export class UserController {
    async getUsers(req: Request, res: Response) {
        const users = await userService.getUsers();
        // needs proper formatting, pagination and validation before sending the response.
        res.status(200).json(users);
    };

    // This is admin functionality. For now let's just create students only with hardcoded logic.
    async createUser(req: Request, res: Response) {
        const userData: CreateUserInputRegister = req.body; // TODO: add validation logic
        const ROLE = "STUDENT"; // temporary
        const user = await userService.createUser({ ...userData, role: ROLE }); 
        res.status(201).json(user);
    }
}
