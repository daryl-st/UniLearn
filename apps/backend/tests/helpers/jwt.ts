import jwt from "jsonwebtoken";
import type { Role } from "@unilearn/shared-types";

const DEFAULT_ACCESS_SECRET = "test-access-secret";

export function ensureTestSecrets(): void {
    if (!process.env.ACCESS_TOKEN_SECRET) {
        process.env.ACCESS_TOKEN_SECRET = DEFAULT_ACCESS_SECRET;
    }
}

export function makeAccessToken(userId: string, role: Role): string {
    ensureTestSecrets();
    return jwt.sign({ sub: userId, role }, process.env.ACCESS_TOKEN_SECRET as string, {
        expiresIn: "15m",
    });
}
