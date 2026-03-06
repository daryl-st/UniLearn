import { Router } from "express";
import { UserController } from "./users.controller.js";
// import { auth } from "../../middlewares/auth.js";

const router: Router = Router();
const controller = new UserController();

router.get("/", controller.getUsers); // auth middleware is working
router.post("/", controller.createUser);

export default router;