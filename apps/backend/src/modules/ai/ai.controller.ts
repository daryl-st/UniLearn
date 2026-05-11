import type { Response } from "express";
import { z } from "zod";

import type { AuthRequest } from "../../middlewares/auth.js";
import { AiConfigError, proxyExtractFile, proxyExtractUrl } from "./ai.service.js";

const extractUrlBodySchema = z.object({
    url: z.string().url().max(2048),
});

export class AiController {
    extractFile = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const file = req.file;
            if (!file?.buffer?.length) {
                res.status(400).json({
                    error: "Missing PDF file (multipart field name: file)",
                });
                return;
            }

            const result = await proxyExtractFile(file.buffer, file.originalname || "upload.pdf");
            if (!result.ok) {
                res.status(result.status).json(result.body);
                return;
            }
            res.status(200).json(result.body);
        } catch (e) {
            if (e instanceof AiConfigError) {
                res.status(503).json({ error: e.message });
                return;
            }
            res.status(502).json({
                error: "AI service unreachable",
                detail: e instanceof Error ? e.message : String(e),
            });
        }
    };

    extractUrl = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const parsed = extractUrlBodySchema.safeParse(req.body);
            if (!parsed.success) {
                res.status(400).json({
                    error: "Invalid body",
                    issues: parsed.error.flatten(),
                });
                return;
            }

            const result = await proxyExtractUrl(parsed.data.url);
            if (!result.ok) {
                res.status(result.status).json(result.body);
                return;
            }
            res.status(200).json(result.body);
        } catch (e) {
            if (e instanceof AiConfigError) {
                res.status(503).json({ error: e.message });
                return;
            }
            res.status(502).json({
                error: "AI service unreachable",
                detail: e instanceof Error ? e.message : String(e),
            });
        }
    };
}
