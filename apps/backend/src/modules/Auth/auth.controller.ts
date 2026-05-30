import type { Request, Response } from "express";
import { AuthService } from "./auth.service.js";
import { UserRepository } from "../user/user.repository.js";
import type { LoginBody, RegisterBody } from "../../schemas/index.js";
import type { AuthRequest } from "../../middlewares/auth.js";
import { REFRESH_TOKEN_COOKIE_NAME, refreshTokenCookieOptions } from "./auth.cookie.js";

const userRepository = new UserRepository();
const authService = new AuthService(userRepository);

export class AuthController {
    async registerUser(req: Request, res: Response) {
        const userData = req.body as RegisterBody;
        const { user, userProfile, accessToken, refreshToken } =
            await authService.registerUser(userData);

        res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, refreshTokenCookieOptions());

        res.status(201).json({
            user: user.toJson(),
            userProfile: {
                studentId: userProfile.studentId,
                academicYear: userProfile.academicYear,
                departmentId: userProfile.departmentId,
            },
            accessToken,
        });
    }

    async loginUser(req: Request, res: Response) {
        const user = req.body as LoginBody;
        const userData = await authService.loginUser(user);

        res.cookie(REFRESH_TOKEN_COOKIE_NAME, userData.refreshToken, refreshTokenCookieOptions());

        res.status(200).json({
            user: userData.existingUser.toJson(),
            accessToken: userData.accessToken,
        });
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

    async me(req: AuthRequest, res: Response) {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const userId = req.user.userId;
        const user = await userRepository.findUserById(userId);
        if (!user) throw new Error("User not found!");

        return res.json({
            user: user.toJson(),
        });
    }
}
