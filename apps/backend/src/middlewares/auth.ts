import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

const JWT_SECRET = process.env.JWT_SECRET as string;

export interface AuthRequest extends Request {
    user?: any;
}

export const auth = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization || '';
    const [ scheme, token ] = authHeader.split(' ');

    if (scheme != 'Bearer' || !token) return res.status(401).json({ message: "Missing Authorization Header!"});

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid token." });

        req.user = user; // if succesful, attach it to the user
        next();
    })
}