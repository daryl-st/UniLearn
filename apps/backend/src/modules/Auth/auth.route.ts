import { Router } from "express";
import { AuthController } from "./auth.controller.js";
import { validateBody, validateQuery } from "../../middlewares/validate.js";
import { loginSchema, registerSchema, changePasswordSchema, verifyEmailQuerySchema, forgotPasswordSchema, resetPasswordSchema, resendVerificationSchema } from "../../schemas/index.js";
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
router.get(
    "/verify-email",
    validateQuery(verifyEmailQuerySchema),
    asyncHandler((req, res) => controller.verifyEmail(req, res)),
);
router.post(
    "/resend-verification",
    validateBody(resendVerificationSchema),
    asyncHandler((req, res) => controller.resendVerification(req, res)),
);
router.post(
    "/forgot-password",
    validateBody(forgotPasswordSchema),
    asyncHandler((req, res) => controller.forgotPassword(req, res)),
);
router.post(
    "/reset-password",
    validateBody(resetPasswordSchema),
    asyncHandler((req, res) => controller.resetPassword(req, res)),
);
router.post("/refresh", asyncHandler((req, res) => controller.refresh(req, res)));
router.post("/logout", asyncHandler((req, res) => controller.logout(req, res)));
router.get("/me", requireAuth, asyncHandler((req, res) => controller.me(req, res)));
router.post(
    "/change-password",
    requireAuth,
    validateBody(changePasswordSchema),
    asyncHandler((req, res) => controller.changePassword(req, res)),
);

export default router;
