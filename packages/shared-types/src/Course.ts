export type FileType = "PDF" | "PPT" | "DOC"

export type ResourceStatus = "QUEUED" | "PROCESSING" | "READY" | "FAILED"

// base course interface
export interface Course {
    id: string;
    name: string;
    code: string;
    instructorId: string;
    acadamicYear: number;
    departmentId: string;
    resources?: Resource[];
};

// API request & response for creating a course
export interface CreateCourseInput {
    name: string;
    code: string;
    instructorId: string;
    acadamicYear: number;
    departmentId: string;
}

// API response for updating a course
export interface UpdateCourseInput {
    name?: string;
    code?: string;
    instructorId?: string;
    acadamicYear?: number;
};

// base resource interface
export interface Resource {
    id: string;
    title: string;
    type: FileType;
    fileUrl: string;
    courseId: string;
    isDeleted: boolean;
    version: number;
    instructorId: string;
    status?: ResourceStatus;
};

export type IngestStatus = "pending" | "ready" | "failed";

export interface UploadResourceResponse {
    resource: Resource;
    ingestStatus?: IngestStatus;
};

// same API request and response for now
export interface CreateResourceInput {
    title: string;
    type: FileType;
    fileUrl: string;
    courseId: string;
    isDeleted: boolean;
    version: number;
    instructorId: string;
};

export interface UpdateResourceInput {
    title?: string;
    fileUrl?: string;
    type?: FileType;
}