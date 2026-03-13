export type FileType = "PDF" | "PPT" | "DOC"

// for now this can be used to send data to the frontend and as response
export interface Course {
    id: string;
    name: string;
    code: string;
    instructorId: string;
    acadamicYear: number;
    departmentId: string;
};

export interface UpdateCourseInput {
    instructorId?: string;
    acadamicYear?: string;
};

// same request and response for now
export interface Resource {
    title: string;
    type: FileType;
    fileUrl: string;
    courseId: string;
    instructorId: string;
};

export interface UpdateResourceInput {
    title?: string;
    fileUrl?: string;
    type?: string;
}