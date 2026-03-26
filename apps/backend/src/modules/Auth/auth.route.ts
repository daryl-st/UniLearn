import { Router } from "express";
import { AuthController } from "./auth.controller.js";
import { validateBody } from "../../middlewares/validate.js";
import { loginSchema, registerSchema } from "../../schemas/index.js";
import { requireAuth } from "../../middlewares/auth.js";

const router: Router = Router();
const controller = new AuthController();

router.post("/register", validateBody(registerSchema) ,controller.registerUser);
router.post("/login", validateBody(loginSchema), controller.loginUser);
router.get("/me", requireAuth, controller.me);

export default router;