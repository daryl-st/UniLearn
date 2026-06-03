import { getCourseThumbnailUrl, type CourseThumbnailInput } from "@unilearn/shared-types";

/** MVP scope: catalog and profiles are Computer Science only. */
export const MVP_DEPARTMENT_LABEL = "Computer Science";

export type CourseThumbInput = CourseThumbnailInput;

/** Thematic course cover for catalog cards (maps by course code / name, not random photos). */
export function courseThumbUrl(input: CourseThumbInput): string {
    return getCourseThumbnailUrl(input);
}
