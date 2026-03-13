import { Router } from "express";
import { ResourceController } from "./resource.controller.js";
import { validateBody } from "../../middlewares/validate.js";
import { createCourseSchema, deleteResourceSchema, uploadResourceSchema } from "../../schemas/index.js";

const router: Router = Router();
const controller = new ResourceController();

router.get("/", controller.getCourses);
router.post("/", validateBody(createCourseSchema), controller.createCourse);
router.get("/:id", controller.getCourseById);
router.get("/resource", controller.getResources);
router.post("/resource", validateBody(uploadResourceSchema), controller.uploadResource);
router.get("/resources/:id", controller.getResourceById);
router.delete("/resource/:id", validateBody(deleteResourceSchema), controller.deleteResource);

export default router;
