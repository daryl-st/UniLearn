import { Router } from "express";
import { AuthController } from "./auth.controller.js";
import { validateBody } from "../../middlewares/validate.js";
import { loginSchema, registerSchema } from "../../schemas/index.js";
import { requireAuth } from "../../middlewares/auth.js";
import { asyncHandler } from "../../middlewares/asyncHandler.js";

const router: Router = Router();
const controller = new AuthController();

router.post(
    "/register",
    validateBody(registerSchema),
    asyncHandler((req, res) => controller.registerUser(req, res)),
);
router.post(
    "/login",
    validateBody(loginSchema),
    asyncHandler((req, res) => controller.loginUser(req, res)),
);
router.post("/refresh", asyncHandler((req, res) => controller.refresh(req, res)));
router.post("/logout", asyncHandler((req, res) => controller.logout(req, res)));
router.get("/me", requireAuth, asyncHandler((req, res) => controller.me(req, res)));

export default router;
