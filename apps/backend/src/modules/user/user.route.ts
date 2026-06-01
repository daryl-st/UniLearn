import { Router } from "express";
import { UserController } from "./users.controller.js";
import { authorize, requireAuth } from "../../middlewares/auth.js";
// import { auth } from "../../middlewares/auth.js";

const router: Router = Router();
const controller = new UserController();

router.get("/", requireAuth, authorize("ADMIN"), controller.getUsers); // auth middleware is working
router.post("/", requireAuth, authorize("ADMIN"), controller.createUser);
router.put("/:id", requireAuth, authorize("ADMIN"), controller.updateUser);
router.delete("/:id", requireAuth, authorize("ADMIN"), controller.deleteUser);

export default router;