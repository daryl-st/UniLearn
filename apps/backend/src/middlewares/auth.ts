import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

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

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid token." });

        req.user = user; // if succesful, attach it to the user
        next();
    })
}