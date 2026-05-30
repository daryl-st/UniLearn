import type { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";

const AUTH_STATUS_MAP: Record<string, number> = {
    "Email already registered!": 409,
    "User not found!": 401,
    "Invalid email or password!": 401,
    "Invalid Department": 500,
    "Run database seed first": 503,
    "Internal Error!": 500,
    "Failed to create profile": 500,
};

function messageFromError(err: unknown): string {
    if (err instanceof Error && err.message) {
        return err.message;
    }
    return "Something went wrong. Please try again.";
}

function statusFromError(err: unknown, message: string): number {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
            return 409;
        }
    }

    const mapped = AUTH_STATUS_MAP[message];
    if (mapped !== undefined) {
        return mapped;
    }

    return 500;
}

export function errorHandler(
    err: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction,
): void {
    const message = messageFromError(err);
    let status = statusFromError(err, message);

    if (status === 409 && message === "Email already registered!") {
        res.status(status).json({ message });
        return;
    }

    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
        res.status(409).json({ message: "Account or profile already exists." });
        return;
    }

    if (status === 500 && !AUTH_STATUS_MAP[message]) {
        res.status(500).json({ message: "Something went wrong. Please try again." });
        return;
    }

    if (message === "Invalid Department") {
        res.status(500).json({
            message: "Department setup is incomplete. Run database seed first.",
        });
        return;
    }

    if (message === "Run database seed first") {
        res.status(503).json({ message: "Run database seed first." });
        return;
    }

    res.status(status).json({ message });
}
