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

        const { user, studentProfile, courseProgress } = await authService.getMe(
            req.user.userId,
        );

        return res.json({
            user: user.toJson(),
            studentProfile,
            courseProgress,
        });
    }

    async changePassword(req: Request, res: Response) {
        try {
            const authReq = req as AuthRequest;
            const { password } = req.body;
            if (!authReq.user) {
                return res.status(401).json({ error: "Unauthorized" });
            }
            if (!password || password.length < 8) {
                return res.status(400).json({ error: "Password must be at least 8 characters long." });
            }

            const bcrypt = await import("bcrypt");
            const hashedPassword = await bcrypt.default.hash(password, 10);

            // Import db config dynamically to avoid top level imports if preferred, or use prisma directly.
            // Let's use the local db import. We can import it at the top or dynamically import it.
            const dbModule = await import("../../config/db.js");
            const db = dbModule.default;

            await db.user.update({
                where: { id: authReq.user.userId },
                data: {
                    password: hashedPassword,
                    mustChangePassword: false,
                },
            });

            return res.status(200).json({ message: "Password updated successfully" });
        } catch (error: any) {
            console.error("Error changing password:", error);
            return res.status(500).json({ error: "Failed to change password" });
        }
    }
}
