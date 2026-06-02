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

export function validateQuery<T>(schema: ZodType<T>) {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            const parsed = schema.parse(req.query);
            (req as Request & { validatedQuery?: T }).validatedQuery = parsed;
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