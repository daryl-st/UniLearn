import { Router } from "express";
import multer from "multer";

// import { authorize, requireAuth } from "../../middlewares/auth.js";
import { AiController } from "./ai.controller.js";

const router: Router = Router();
const controller = new AiController();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 15 * 1024 * 1024 },
});

router.post(
    "/extract/file",
    // requireAuth,
    // authorize("INSTRUCTOR", "ADMIN"),
    upload.single("file"),
    controller.extractFile,
);

router.post(
    "/extract/url",
    // requireAuth,
    // authorize("INSTRUCTOR", "ADMIN"),
    controller.extractUrl,
);

export default router;
