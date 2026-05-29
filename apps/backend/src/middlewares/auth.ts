import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction, RequestHandler } from "express";
import type { Role } from "@unilearn/shared-types";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string;

export interface AuthUser {
    userId: string;
    role: Role;
}

export interface AuthRequest extends Request {
    user?: AuthUser;
}


function userFromAccessTokenPayload(decoded: jwt.JwtPayload): AuthUser | null {
    const sub = typeof decoded.sub === "string" ? decoded.sub : null;
    const role = decoded.role;
    if (!sub || typeof role !== "string") return null;
    return { userId: sub, role: role as Role };
}

export const auth = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization || "";
    const [scheme, tokenFromHeader] = authHeader.split(" ");
    const tokenFromCookie = req.cookies?.access_token;

    const token = scheme === "Bearer" && tokenFromHeader ? tokenFromHeader : tokenFromCookie;

    if (!token) return res.status(401).json({ message: "Missing Authorization Header!" });

    jwt.verify(token, ACCESS_TOKEN_SECRET, (err: jwt.VerifyErrors | null, decoded: string | jwt.JwtPayload | undefined) => {
        if (err) return res.status(403).json({ message: "Invalid token." });
        if (!decoded || typeof decoded === "string") {
            return res.status(403).json({ message: "Invalid token." });
        }
        const user = userFromAccessTokenPayload(decoded);
        if (!user) return res.status(403).json({ message: "Invalid token." });

        req.user = user;
        return next();
    });
    return;
};

export const requireAuth: RequestHandler = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized " });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token!, ACCESS_TOKEN_SECRET!) as jwt.JwtPayload;
        const user = userFromAccessTokenPayload(decoded);
        if (!user) {
            return res.status(401).json({ error: "Invalid token! " });
        }
        req.user = user;
        return next();
    } catch {
        return res.status(401).json({ error: "Invalid token! " });
    }
};

export const authorize = (...roles: Role[]): RequestHandler => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ error: "Forbidden" });
        }

        return next();
    };
};
