import type { Request, Response } from "express";
import { CourseRepository, ResourceRepository } from "./resource.repository.js";
import { CourseService, ResourceService } from "./resource.service.js";
import type { createCourseBody, deleteResourceBody, uploadResourceBody } from "../../schemas/index.js";
import { UserRepository } from "../user/user.repository.js";

const resourceRepo = new ResourceRepository();
const resourceService = new ResourceService(resourceRepo);
const courseRepo = new CourseRepository();
const userRepository = new UserRepository();
const courseService = new CourseService(courseRepo, userRepository);

export class ResourceController {
    async getResources(req: Request, res: Response) {
        // the basic idea is this func will return all resources specific to a course
        const resources = await resourceService.getResources("ca010cdb-9a41-4512-8300-bb5f60fc25c0"); 
        res.status(200).json(resources);
    };

    async getCourses(req: Request, res: Response) {
        // returns all courses name, code, all other important needs
        // course resorces should not be returned at this request and a course might have 0 resources
        // this will be requested when the user is presented with a list of courses.
        const courses = await courseService.getCourses();

        const courseData = courses.map(course => ({
            id: course.id,
            name: course.name,
            code: course.code,
            acadamicYear: course.acadamicYear,
            instructorId: course.instructorId,
            departmentId: course.departmentId,
        }));

        res.status(200).json(courseData);
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
        // will be prompted to available courses it teaches to upload onto them only
        const resourceDetails = req.body as uploadResourceBody;

        // instructor id and course id should come from req.body but for now let's hardcode it
        const resourceData = {
            ...resourceDetails,
            instructorId: "cc33d76b-9344-48ee-8954-ece7114a6f32",
            courseId: "ca010cdb-9a41-4512-8300-bb5f60fc25c0",
            version: 1, // we will update this when we implement update resource, for now it is fixed to 1
        }
        const resource = await resourceService.uploadResource(resourceData);
        res.status(201).json(resource);

        // should update resource be separate function or should this function handle this ??
        // because updating is essentially same resource with same meta-data, but with only version change.
        // so i should integrate version number in the db so that when updating we only change version number and the url
        // if this is the case how do find the older version, so we should add version but also implement new function 
    }

    async createCourse(req: Request, res: Response) {
        // we need to assign the instructor to course and department (fixed for now - CS) 
        const courseDetails = req.body as createCourseBody;

        // we might create a selection thing to select and assign the instructor and also the department
        // then will be included in the req.body
        const courseData = {
            ...courseDetails,
            instructorId: "cc33d76b-9344-48ee-8954-ece7114a6f32", // id for instructor
            departmentId: "ff4d9866-61fa-48a1-bdbf-1883eda940f3", // id for CS, remove this later
        }
        const course = await courseService.createCourse(courseData);
        res.status(201).json(course);
    }

    async deleteResource(req: Request, res: Response) {
        // const { resourceId, instructorId } = req.body; // this should be the correct implementation, but using params
        const resourceData = req.body as deleteResourceBody;
        const instructorId = "cc33d76b-9344-48ee-8954-ece7114a6f32";
        const resource = await resourceService.deleteResource(resourceData, instructorId);
        res.status(200).json(resource);
    }
}