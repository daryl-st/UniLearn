import { Router } from "express";
import { DashboardController } from "./dashboard.controller.js";
import { authorize, requireAuth } from "../../middlewares/auth.js";

const router: Router = Router();
const controller = new DashboardController();

router.get("/admin", requireAuth, authorize("ADMIN"), (req, res) => {
    void controller.getAdminStats(req, res);
});

router.get("/instructor", requireAuth, authorize("INSTRUCTOR"), (req, res) => {
    void controller.getInstructorStats(req, res);
});

router.get("/student", requireAuth, authorize("STUDENT"), (req, res) => {
    void controller.getStudentStats(req, res);
});

export default router;
