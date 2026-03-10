import type { Request, Response } from "express";
import { AuthService } from "./auth.service.js";
import { UserRepository } from "../user/user.repository.js";
import type { CreateUserInput, CreateUserInputLogin, User } from "@unilearn/shared-types";
import type { LoginBody, RegisterBody } from "../../schemas/index.js";

const userRepository = new UserRepository();
const authService = new AuthService(userRepository);

const profileData = {
    studentId: "UGR/0905/15",
    year: 2024,
}

const instructorData = {
    instructorId: "INS/0905/15",
    departmentId: 'CS',
}

let userProfile;

export class AuthController {
    async registerUser(req: Request, res: Response) {
        const userData = req.body as RegisterBody;
        const { user, token } = await authService.registerUser(userData);
        
        // Need better implementation
        if (user.role == 'STUDENT') {
            userProfile = await authService.createStudentProfile(profileData, user.email);
        } else if (user.role == 'INSTRUCTOR') { // we might not needs this coz only admins are allowed to create instructor acc
            userProfile = await authService.createInstructorProfile(instructorData, user.email);
        } else {
            throw new Error("Failed to create profile");
        }

        res.status(201).json({ user, userProfile }) // add token and session thing...
    };

    async loginUser(req: Request, res: Response) {
        const user = req.body as LoginBody;

        // user type has to correct to be in sync with returned data
        const userData = (await authService.loginUser(user));

        res.cookie("refreshToken", userData.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict"
        })

        res.status(200).json({ user: userData.existingUser, accessToken: userData.accessToken });
    };

    async refresh(req: Request, res: Response) {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.status(401).json({ message: "No refresh token!"});

        try {
            const refresh = await authService.refresh(refreshToken);

            res.cookie("refreshToken", refresh.newRefreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
            })

            return res.json({ accessToken: refresh.newAccessToken });
        } catch (err) {
            return res.status(403).json({ message: "Invalid refresh token "});
        }
    };

    async logout(req: Request, res: Response) {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) res.sendStatus(204);

        // revoked: true
        authService.logout(refreshToken);

        res.clearCookie("refreshToken");

        res.sendStatus(204);
    }
}