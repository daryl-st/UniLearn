import { Router } from "express";
import { ResourceController } from "./resource.controller.js";
import { validateBody } from "../../middlewares/validate.js";
import {
    createCourseSchema,
    updateCourseSchema,
    assignInstructorSchema,
    deleteResourceBodySchema,
    uploadResourceSchema,
} from "../../schemas/index.js";
import { maybeSingle } from "./upload.middleware.js";
import { requireAuth, authorize } from "../../middlewares/auth.js";

const router: Router = Router();
const controller = new ResourceController();

router.get("/", controller.getCourses);
router.post("/", requireAuth, authorize("ADMIN"), validateBody(createCourseSchema), controller.createCourse);

// Static paths must be registered before `/:id` so `/resource` is not captured as an id.
router.get("/resource", requireAuth, controller.getResources);
// Accept multipart/form-data (file field 'file') or JSON body. maybeSingle will only act for multipart requests.
router.post("/resource", requireAuth, maybeSingle('file'), validateBody(uploadResourceSchema), controller.uploadResource);
router.get("/resources/:id/file", requireAuth, controller.streamResourceFile);
router.get("/resources/:id", requireAuth, controller.getResourceById);
router.delete("/resource/:id", requireAuth, validateBody(deleteResourceBodySchema), controller.deleteResource);

router.put("/:id", requireAuth, authorize("ADMIN"), validateBody(updateCourseSchema), controller.updateCourse);
router.post("/:id/instructors", requireAuth, authorize("ADMIN"), validateBody(assignInstructorSchema), controller.assignInstructor);
router.delete("/:id/instructors/:instructorId", requireAuth, authorize("ADMIN"), controller.unassignInstructor);
router.get("/:id/instructors", requireAuth, authorize("ADMIN"), controller.getCourseInstructors);
router.delete("/:id", requireAuth, authorize("ADMIN"), controller.deleteCourse);
router.get("/:id", requireAuth, controller.getCourseById);

export default router;
