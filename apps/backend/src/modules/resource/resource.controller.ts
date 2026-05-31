import type { Request, Response } from "express";
import type { AuthRequest } from "../../middlewares/auth.js";
import { z } from "zod";
import { CourseRepository, ResourceRepository } from "./resource.repository.js";
import { CourseService, ResourceService } from "./resource.service.js";
import type { createCourseBody, deleteResourceBody, uploadResourceBody } from "../../schemas/index.js";
import { UserRepository } from "../user/user.repository.js";
import { cloudinaryService, CloudinaryNotConfiguredError } from "./cloudinary.service.js";

function paramId(value: string | string[] | undefined): string | undefined {
    if (value === undefined) return undefined;
    return Array.isArray(value) ? value[0] : value;
}

const resourceRepo = new ResourceRepository();
const resourceService = new ResourceService(resourceRepo);
const courseRepo = new CourseRepository();
const userRepository = new UserRepository();
const courseService = new CourseService(courseRepo, userRepository);

const courseIdQuerySchema = z.object({
    courseId: z.string().uuid(),
});

export class ResourceController {
    async getResources(req: Request, res: Response) {
        const parsed = courseIdQuerySchema.safeParse(req.query);
        if (!parsed.success) {
            return res.status(400).json({
                error: "Invalid or missing courseId query parameter.",
            });
        }

        const authReq = req as AuthRequest;
        if (authReq.user?.role === "INSTRUCTOR") {
            const course = await courseRepo.findOne({ id: parsed.data.courseId });
            if (!course || course.instructorId !== authReq.user.userId) {
                return res.status(403).json({ error: "Forbidden: Instructor not assigned to this course" });
            }
        }

        const resources = await resourceService.getResources(parsed.data.courseId);
        return res.status(200).json(resources);
    }

    async getCourses(req: Request, res: Response) {
        const authHeader = req.headers.authorization;
        let instructorId: string | undefined;

        if (authHeader?.startsWith("Bearer ")) {
            const token = authHeader.split(" ")[1];
            try {
                const jwtModule = await import("jsonwebtoken");
                const decoded = jwtModule.default.verify(token!, process.env.ACCESS_TOKEN_SECRET!) as any;
                if (decoded.role === "INSTRUCTOR" && decoded.sub) {
                    instructorId = decoded.sub;
                }
            } catch {}
        }

        const courses = await courseService.getCourses(instructorId);
        return res.status(200).json(courses);
    }

    async getResourceById(req: Request, res: Response) {
        const id = paramId(req.params.id);
        if (!id) {
            return res.status(400).json({ error: "Missing resource id." });
        }
        const resource = await resourceService.getResourceById({ id });
        if (!resource) {
            return res.status(404).json({ error: "Resource not found." });
        }
        return res.status(200).json(resource);
    }

    async getCourseById(req: Request, res: Response) {
        const id = paramId(req.params.id);
        if (!id) {
            return res.status(400).json({ error: "Missing course id." });
        }
        const course = await courseService.getCourseById({ id });
        if (!course) {
            return res.status(404).json({ error: "Course not found." });
        }
        return res.status(200).json(course);
    }

    async uploadResource(req: Request, res: Response) {
        const resourceDetails = req.body as uploadResourceBody;

        const authReq = req as AuthRequest;
        if (authReq.user?.role === "INSTRUCTOR") {
            resourceDetails.instructorId = authReq.user.userId;
            const course = await courseRepo.findOne({ id: resourceDetails.courseId });
            if (!course || course.instructorId !== authReq.user.userId) {
                return res.status(403).json({ error: "Instructor is not assigned to this course." });
            }
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const maybeFile = (req as any).file as
            | { buffer: Buffer; originalname?: string; mimetype?: string }
            | undefined;

        let cloudinaryPublicId: string | undefined;
        let needsConversion = false;

        if (maybeFile?.buffer) {
            if (!cloudinaryService.isConfigured) {
                return res.status(503).json({
                    error: "Cloudinary is not configured. Set CLOUDINARY_URL or CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET.",
                });
            }

            try {
                const upload = await cloudinaryService.uploadResourceFile(
                    maybeFile.buffer,
                    maybeFile.originalname ?? "file",
                    maybeFile.mimetype,
                );
                cloudinaryPublicId = upload.publicId;
                needsConversion = upload.needsConversion;
                resourceDetails.fileUrl = needsConversion ? upload.originalUrl : upload.pdfUrl;
            } catch (err) {
                if (err instanceof CloudinaryNotConfiguredError) {
                    return res.status(503).json({ error: err.message });
                }
                console.error("Cloudinary upload failed:", err);
                return res.status(502).json({ error: "Failed to upload file to storage." });
            }
        } else if (!resourceDetails.fileUrl?.trim()) {
            return res.status(400).json({ error: "Provide a file upload or a public fileUrl." });
        }

        const resourceData = {
            title: resourceDetails.title,
            type: resourceDetails.type,
            fileUrl: resourceDetails.fileUrl!.trim(),
            courseId: resourceDetails.courseId,
            instructorId: resourceDetails.instructorId,
            version: 1,
            ...(cloudinaryPublicId ? { cloudinaryPublicId } : {}),
            needsConversion,
        };

        const result = await resourceService.uploadResource(resourceData);
        if (!result.ok) {
            return res.status(409).json({ error: result.message });
        }

        return res.status(201).json({
            resource: result.resource,
            ingestStatus: result.ingestStatus,
        });
    }

    async createCourse(req: Request, res: Response) {
        const courseDetails = req.body as createCourseBody;
        const course = await courseService.createCourse(courseDetails);
        if (typeof course === "string") {
            return res.status(400).json({ error: course });
        }
        return res.status(201).json(course);
    }

    async deleteCourse(req: Request, res: Response) {
        const id = paramId(req.params.id);
        if (!id) {
            return res.status(400).json({ error: "Missing course id." });
        }
        const result = await courseService.deleteCourse({ id });
        if (typeof result === "string") {
            return res.status(404).json({ error: result });
        }
        return res.status(200).json(result);
    }

    async deleteResource(req: Request, res: Response) {
        const resourceId = paramId(req.params.id);
        if (!resourceId) {
            return res.status(400).json({ error: "Missing resource id." });
        }
        const { instructorId } = req.body as deleteResourceBody;
        const resource = await resourceService.deleteResource({ id: resourceId }, instructorId);
        if (typeof resource === "string") {
            const status = resource === "Permission Denied!" ? 403 : 404;
            return res.status(status).json({ error: resource });
        }
        return res.status(200).json(resource);
    }
}
