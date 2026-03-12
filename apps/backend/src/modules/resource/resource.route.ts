import { Router } from "express";
import { ResourceController } from "./resource.controller.js";

const router: Router = Router();
const controller = new ResourceController();

router.get("/", controller.getCourses);
router.get("/resource", controller.getResources);
router.post("/", controller.createCourse);
router.post("/resource", controller.uploadResource);
router.get("/:id", controller.getCourseById);
router.get("/resources/:id", controller.getResourceById);

export default router;
