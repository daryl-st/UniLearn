import type { Request, Response } from "express";
import { CourseRepository, ResourceRepository } from "./resource.repository.js";
import { CourseService, ResourceService } from "./resource.service.js";

const resourceRepo = new ResourceRepository();
const resourceService = new ResourceService(resourceRepo);
const courseRepo = new CourseRepository();
const courseService = new CourseService(courseRepo);

export class ResourceController {
    async getResources(req: Request, res: Response) {
        const resources = await resourceService.getResources();
        res.status(200).json(resources);
    };

    async getCourses(req: Request, res: Response) {
        const courses = await courseService.getCourses();
        res.status(200).json(courses);
    }

    async getResourceById(req: Request, res: Response) {
        const resourceData = req.body; // we need to change to params
        const resource = await resourceService.getResourceById(resourceData.id);
        res.status(200).json(resource);
    }

    async getCourseById(req: Request, res: Response) {
        const courseData = req.body; // we need to change to params
        const course = await courseService.getCourseById(courseData.id);
        res.status(200).json(course);
    }

    async uploadResource(req: Request, res: Response) {
        const resourceData = req.body;
        const resource = await resourceService.uploadResource(resourceData);
        res.status(201).json(resource);
    }

    async createCourse(req: Request, res: Response) {
        const courseData = req.body;
        const course = await courseService.createCourse(courseData);
        res.status(201).json(course);
    }
}