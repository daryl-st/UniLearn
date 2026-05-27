import type { Request, Response } from "express";
import { AuthService } from "./auth.service.js";
import { UserRepository } from "../user/user.repository.js";
import type { LoginBody, RegisterBody } from "../../schemas/index.js";
import type { AuthRequest } from "../../middlewares/auth.js";
import { REFRESH_TOKEN_COOKIE_NAME, refreshTokenCookieOptions } from "./auth.cookie.js";

const userRepository = new UserRepository();
const authService = new AuthService(userRepository);

const profileData = {
    studentId: "UGR/0906/15",
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
        const { user, accessToken, refreshToken } = await authService.registerUser(userData);

        if (user.role === "STUDENT") {
            userProfile = await authService.createStudentProfile(profileData, user.email);
        } else if (user.role === "INSTRUCTOR") {
            userProfile = await authService.createInstructorProfile(instructorData, user.email);
        } else {
            throw new Error("Failed to create profile");
        }

        const cookieOpts = refreshTokenCookieOptions();
        res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, cookieOpts);

        res.status(201).json({ user, userProfile, accessToken });
    }

    async loginUser(req: Request, res: Response) {
        const user = req.body as LoginBody;

        // user type has to correct to be in sync with returned data
        const userData = await authService.loginUser(user);

        res.cookie(REFRESH_TOKEN_COOKIE_NAME, userData.refreshToken, refreshTokenCookieOptions());

        res.status(200).json({ user: userData.existingUser, accessToken: userData.accessToken });
    }

    async refresh(req: Request, res: Response) {
        const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE_NAME];
        if (!refreshToken) return res.status(401).json({ message: "No refresh token!"});

        try {
            const refresh = await authService.refresh(refreshToken);

            res.cookie(REFRESH_TOKEN_COOKIE_NAME, refresh.newRefreshToken, refreshTokenCookieOptions());

            return res.json({ accessToken: refresh.newAccessToken });
        } catch {
            return res.status(403).json({ message: "Invalid refresh token "});
        }
    }

    async logout(req: Request, res: Response) {
        const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE_NAME];
        const cookieOpts = refreshTokenCookieOptions();

        if (!refreshToken) {
            res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, cookieOpts);
            return res.sendStatus(204);
        }

        await authService.logout(refreshToken);

        res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, cookieOpts);
        return res.sendStatus(204);
    }

    // refactor
    async me(req: AuthRequest, res: Response) {
        if (!req.user) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const userId = req.user.userId;
        const user = await userRepository.findUserById(userId);
        if (!user) throw new Error("User not found!");

        return res.json({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });
    }
}