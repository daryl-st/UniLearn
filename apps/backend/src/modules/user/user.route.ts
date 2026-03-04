import { Router } from "express";
import { UserController } from "./users.controller.js";

const router: Router = Router();
const controller = new UserController();

router.get("/", controller.getUsers);
router.post("/", controller.createUser);

export default router;