import { Router } from "express";
import { ResourceController } from "./resource.controller.js";
import { validateBody } from "../../middlewares/validate.js";
import {
    createCourseSchema,
    deleteResourceBodySchema,
    uploadResourceSchema,
} from "../../schemas/index.js";

const router: Router = Router();
const controller = new ResourceController();

router.get("/", controller.getCourses);
router.post("/", validateBody(createCourseSchema), controller.createCourse);

// Static paths must be registered before `/:id` so `/resource` is not captured as an id.
router.get("/resource", controller.getResources);
router.post("/resource", validateBody(uploadResourceSchema), controller.uploadResource);
router.get("/resources/:id", controller.getResourceById);
router.delete("/resource/:id", validateBody(deleteResourceBodySchema), controller.deleteResource);

router.delete("/:id", controller.deleteCourse);
router.get("/:id", controller.getCourseById);

export default router;
