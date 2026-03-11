import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction, RequestHandler } from "express";
import type { Role } from "@unilearn/shared-types";

const JWT_SECRET = process.env.JWT_SECRET as string;
const ACCESS_TTL = '15m';
const REFRESH_TTL_SEC = 60 * 60 * 24 * 7; // 7 days


export interface AuthRequest extends Request {
    user?: any;
}

export const auth = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization || '';
    const [ scheme, tokenFromHeader ] = authHeader.split(' ');
    const tokenFromCookie = req.cookies?.access_token;

    const token = scheme === 'Bearer' && tokenFromHeader ? tokenFromHeader : tokenFromCookie;

    if (!token) return res.status(401).json({ message: "Missing Authorization Header!"});

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => { // Needs fix
        if (err) return res.status(403).json({ message: "Invalid token." });

        req.user = user; // if succesful, attach it to the user
        next();
    })
}

export const requireAuth: RequestHandler = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized "});
    }

    const token = authHeader.split(" ")[1];


    try {
        const payload = jwt.verify(token!, JWT_SECRET!) as {
            userId: string,
            role: Role,
        };

        req.user = payload;
        next();
    } catch (err) {
        return res.status(401).json({ error: "Invalid token! "});
    }
}

export const authorize = (...roles: Role[]): RequestHandler => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: "Forbidden" });
        }

        next();
    }
}