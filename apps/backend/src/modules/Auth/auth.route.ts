import { Router } from "express";
import { AuthController } from "./auth.controller.js";

const router: Router = Router();
const controller = new AuthController();

router.post("/register", controller.registerUser);
router.post("/login", controller.loginUser);

export default router;