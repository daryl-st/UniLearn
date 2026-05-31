import { Router } from "express";
import multer from "multer";

import { validateBody } from "../../middlewares/validate.js";
import {
    askResourceSchema,
    generateQuizSchema,
    ingestResourceSchema,
    submitQuizSchema,
    summarizeResourceSchema,
} from "../../schemas/index.js";
import { authorize, requireAuth } from "../../middlewares/auth.js";
import { AiController } from "./ai.controller.js";

const router: Router = Router();
const controller = new AiController();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 15 * 1024 * 1024 },
});

const studentOnly = [requireAuth, authorize("STUDENT")] as const;

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

router.post(
    "/ingest/resource",
    validateBody(ingestResourceSchema),
    controller.ingestResource,
);

router.post(
    "/summarize",
    ...studentOnly,
    validateBody(summarizeResourceSchema),
    controller.summarizeResource,
);

router.get("/summaries", ...studentOnly, controller.listSummaries);

router.post(
    "/generate-quiz",
    ...studentOnly,
    validateBody(generateQuizSchema),
    controller.generateQuiz,
);

router.get("/quizzes", ...studentOnly, controller.listQuizzes);

router.get("/quizzes/:quizId", ...studentOnly, controller.getQuiz);

router.post(
    "/quizzes/:quizId/submit",
    ...studentOnly,
    validateBody(submitQuizSchema),
    controller.submitQuiz,
);

router.get("/quiz-attempts/:attemptId", ...studentOnly, controller.getQuizAttempt);

router.post(
    "/ask",
    ...studentOnly,
    validateBody(askResourceSchema),
    controller.askResource,
);

export default router;
