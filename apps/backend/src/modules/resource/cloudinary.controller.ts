import type { Request, Response } from "express";
import { ResourceRepository } from "./resource.repository.js";
import { ResourceService } from "./resource.service.js";
import { cloudinaryService } from "./cloudinary.service.js";
import { verifyNotificationSignature } from "./cloudinary.utils.js";

const resourceRepo = new ResourceRepository();
const resourceService = new ResourceService(resourceRepo);

export async function handleCloudinaryNotification(req: Request, res: Response): Promise<void> {
    if (!cloudinaryService.isConfigured) {
        res.status(503).json({ error: "Cloudinary is not configured." });
        return;
    }

    const rawBody =
        typeof req.body === "string"
            ? req.body
            : Buffer.isBuffer(req.body)
              ? req.body.toString("utf8")
              : JSON.stringify(req.body ?? {});

    const signature = req.headers["x-cld-signature"];
    const timestamp = req.headers["x-cld-timestamp"];
    const apiSecret = cloudinaryService.getApiSecret();

    const signatureValid = verifyNotificationSignature(
        rawBody,
        typeof timestamp === "string" ? timestamp : undefined,
        typeof signature === "string" ? signature : undefined,
        apiSecret,
    );

    if (!signatureValid && process.env.NODE_ENV === "production") {
        res.status(401).json({ error: "Invalid Cloudinary notification signature." });
        return;
    }

    let payload: Record<string, unknown>;
    try {
        payload = JSON.parse(rawBody) as Record<string, unknown>;
    } catch {
        res.status(400).json({ error: "Invalid notification payload." });
        return;
    }

    try {
        await resourceService.handleCloudinaryNotification(payload);
        res.status(200).json({ ok: true });
    } catch (err) {
        console.error("Cloudinary notification handler failed:", err);
        res.status(500).json({ error: "Failed to process notification." });
    }
}
