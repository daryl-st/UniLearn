import type { Request, Response } from "express";
import { z } from "zod";
import { CourseRepository, ResourceRepository } from "./resource.repository.js";
import { CourseService, ResourceService } from "./resource.service.js";
import type { createCourseBody, deleteResourceBody, uploadResourceBody } from "../../schemas/index.js";
import { UserRepository } from "../user/user.repository.js";
import { cloudinaryService } from "./cloudinary.service.js";

// This will get me the id from req.params.id.
function paramId(value: string | string[] | undefined): string | undefined {
    if (value === undefined) return undefined;
    return Array.isArray(value) ? value[0] : value;
}

const resourceRepo = new ResourceRepository();
const resourceService = new ResourceService(resourceRepo);
const courseRepo = new CourseRepository();
const userRepository = new UserRepository();
const courseService = new CourseService(courseRepo, userRepository);

// we might need to move this validation schema somewhere.
const courseIdQuerySchema = z.object({
    courseId: z.string().uuid(),
});

export class ResourceController {
    async getResources(req: Request, res: Response) {
        // parsing and validating the courseId query parameter using Zod before fetching resources.
        const parsed = courseIdQuerySchema.safeParse(req.query);
        if (!parsed.success) {
            return res.status(400).json({
                error: "Invalid or missing courseId query parameter.",
            });
        }
        const resources = await resourceService.getResources(parsed.data.courseId);
        return res.status(200).json(resources);
    }

    async getCourses(_req: Request, res: Response) {
        const courses = await courseService.getCourses();
        return res.status(200).json(courses);
    }

    async getResourceById(req: Request, res: Response) {
        // this will get me the id from req.params.id.
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
        // this will get me the id from req.params.id.
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
        // Support both JSON body uploads (existing flow) and multipart/form-data (file upload).
        const resourceDetails = req.body as uploadResourceBody;

        // If a multipart file was provided by the instructor, upload to Cloudinary and replace `fileUrl`.
        // `maybeSingle` middleware will populate `req.file` when multipart/form-data is used.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const maybeFile = (req as any).file;
        if (maybeFile && maybeFile.buffer) {
            if (cloudinaryService.isConfigured) {
                try {
                    const secureUrl = await cloudinaryService.uploadBuffer(maybeFile.buffer, maybeFile.originalname);
                    // overwrite fileUrl so the existing DB contract (fileUrl) remains unchanged.
                    if (secureUrl) {
                        (resourceDetails as any).fileUrl = secureUrl;
                    }
                } catch (err) {
                    // keep original comments and return an error without changing API contract.
                    return res.status(500).json({ error: "Failed to upload file to storage." });
                }
            } else if (!resourceDetails.fileUrl) {
                // Allow instructor uploads to proceed even when Cloudinary is not configured,
                // preserving the resource contract with a temporary placeholder URL.
                (resourceDetails as any).fileUrl = `${maybeFile.originalname ?? 'file'}:${Date.now()}`;
            }
        }

        const resourceData = {
            ...resourceDetails,
            // this is a placeholder, we can implement versioning logic later.
            version: 1,
        };
        const resource = await resourceService.uploadResource(resourceData);
        if (typeof resource === "string") {
            return res.status(409).json({ error: resource });
        }
        return res.status(201).json(resource);
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
