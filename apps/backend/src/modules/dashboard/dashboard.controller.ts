import type { Response } from "express";
import type { AuthRequest } from "../../middlewares/auth.js";
import { DashboardService } from "./dashboard.service.js";
import { UserRepository } from "../user/user.repository.js";
import { CourseRepository, ResourceRepository } from "../resource/resource.repository.js";

const userRepository = new UserRepository();
const courseRepository = new CourseRepository();
const resourceRepository = new ResourceRepository();
const dashboardService = new DashboardService(userRepository, courseRepository, resourceRepository);

export class DashboardController {
    async getAdminStats(_req: AuthRequest, res: Response) {
        try {
            const stats = await dashboardService.getAdminStats();
            return res.status(200).json(stats);
        } catch (error) {
            console.error("Error fetching admin stats:", error);
            return res.status(500).json({ error: "Failed to fetch admin stats" });
        }
    }

    async getInstructorStats(req: AuthRequest, res: Response) {
        try {
            const instructorId = req.user?.userId;
            if (!instructorId) {
                return res.status(401).json({ error: "Unauthorized" });
            }
            const stats = await dashboardService.getInstructorStats(instructorId);
            return res.status(200).json(stats);
        } catch (error) {
            console.error("Error fetching instructor stats:", error);
            return res.status(500).json({ error: "Failed to fetch instructor stats" });
        }
    }

    async getStudentStats(req: AuthRequest, res: Response) {
        try {
            const studentId = req.user?.userId;
            if (!studentId) {
                return res.status(401).json({ error: "Unauthorized" });
            }
            const stats = await dashboardService.getStudentStats(studentId);
            return res.status(200).json(stats);
        } catch (error) {
            console.error("Error fetching student stats:", error);
            return res.status(500).json({ error: "Failed to fetch student stats" });
        }
    }
}
