/** AAU undergraduate email: firstname.lastname-ug@aau.edu.et */
export const AAU_STUDENT_EMAIL_REGEX = /^[a-z][a-z0-9]*\.[a-z][a-z0-9]*-ug@aau\.edu\.et$/i;

export const AAU_STUDENT_EMAIL_ERROR =
    "Please use a valid AAU student email (firstname.lastname-ug@aau.edu.et)";

export function isAauStudentEmail(email: string): boolean {
    return AAU_STUDENT_EMAIL_REGEX.test(email.trim());
}

export function normalizeStudentEmail(email: string): string {
    return email.trim().toLowerCase();
}

/** AAU instructor email: firstname.lastname@aau.edu.et */
export const AAU_INSTRUCTOR_EMAIL_REGEX = /^[a-z][a-z0-9]*\.[a-z][a-z0-9]*@aau\.edu\.et$/i;

export const AAU_INSTRUCTOR_EMAIL_ERROR =
    "Please use a valid instructor email (firstname.lastname@aau.edu.et)";

export function isAauInstructorEmail(email: string): boolean {
    return AAU_INSTRUCTOR_EMAIL_REGEX.test(email.trim());
}

export function normalizeInstructorEmail(email: string): string {
    return email.trim().toLowerCase();
}

/** Login accepts any stored account email — trim only, no AAU format rule. */
export function normalizeLoginEmail(email: string): string {
    return email.trim();
}

