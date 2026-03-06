import jwt from "jsonwebtoken";

export function generateAccessToken(userId: string, role: string) {
  return jwt.sign(
    { sub: userId, role },
    process.env.ACCESS_TOKEN_SECRET!,
    { expiresIn: "15m" }
  );
}

export function generateRefreshToken(userId: string) {
  return jwt.sign(
    { sub: userId },
    process.env.REFRESH_TOKEN_SECRET!,
    { expiresIn: "30d" }
  );
}