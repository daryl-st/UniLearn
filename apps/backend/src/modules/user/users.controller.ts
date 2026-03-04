import type { Request, Response } from "express";
import { UserService } from "./users.service.js";
import { UserRepository } from "./user.repository.js";
import type { CreateUserInput } from "@unilearn/shared-types";

const userRepository = new UserRepository();
const userService = new UserService(userRepository);

export class UserController {
    async getUsers(req: Request, res: Response) {
        const users = await userService.getUsers();
        res.status(200).json(users);
    };

    async createUser(req: Request, res: Response) {
        const userData: CreateUserInput = req.body; // TODO: add validation logic
        const user = await userService.createUser(userData); // the types from Shared-types has to match the entity
        res.status(201).json(user);
    }
}
