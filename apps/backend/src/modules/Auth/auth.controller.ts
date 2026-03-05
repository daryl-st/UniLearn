import type { Request, Response } from "express";
import { AuthService } from "./auth.service.js";
import { UserRepository } from "../user/user.repository.js";
import type { CreateUserInput, CreateUserInputLogin, User } from "@unilearn/shared-types";

const userRepository = new UserRepository();
const authService = new AuthService(userRepository);

export class AuthController {
    async registerUser(req: Request, res: Response) {
        const userData: CreateUserInput = req.body;
        // TODO: add validation logic before passing
        const { user, token } = await authService.registerUser(userData);
        res.status(201).json(user) // add token and session thing...
    };

    async loginUser(req: Request, res: Response) {
        // use parse method to validated after initializing zod
        const user: CreateUserInputLogin = req.body;

        // user type has to correct to be in sync with returned data
        const userData = (await authService.loginUser(user));
        res.status(200).json(userData.existingUser);
    }
}