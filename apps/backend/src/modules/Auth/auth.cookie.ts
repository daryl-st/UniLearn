import type { CookieOptions } from "express";

export const REFRESH_TOKEN_COOKIE_NAME = "refreshToken";

/** Match set/clear options or the browser may not remove the cookie. */
export function refreshTokenCookieOptions(): CookieOptions {
    const secure =
        process.env.COOKIE_SECURE === "true" ||
        (process.env.NODE_ENV === "production" && process.env.COOKIE_SECURE !== "false");

    return {
        httpOnly: true,
        secure,
        sameSite: "lax",
        path: "/",
    };
}
