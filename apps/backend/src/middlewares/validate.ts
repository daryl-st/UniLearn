import type { Request, Response, NextFunction } from "express";
import { type ZodType, ZodError } from "zod";

export function validateBody<T>(schema: ZodType<T>) {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            req.body = schema.parse(req.body);
            next();
        } catch (err) {
            if (err instanceof ZodError) {
                res.status(400).json({
                    error: "Validation Failed!",
                    details: err.issues.map(e => ({
                        path: e.path.join('.'),
                        message: e.message
                    })),
                });
                return;
            }
            next();
        }
    };
}