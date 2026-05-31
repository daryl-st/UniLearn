import { ROUTES } from "@/lib/route-paths";
import type { Role } from "@/types/auth";

export type BackendRole = "STUDENT" | "INSTRUCTOR" | "ADMIN";

/** Home dashboard for Prisma/backend role enum. */
export function dashboardPathForBackendRole(role: string | undefined): string {
    const r = (role ?? "STUDENT").toUpperCase();
    if (r === "ADMIN") return ROUTES.ADMIN_DASHBOARD;
    if (r === "INSTRUCTOR") return ROUTES.TEACHER_DASHBOARD;
    return ROUTES.STUDENT_DASHBOARD;
}

/** Settings URL for a backend role (not pathname-inferred). */
export function settingsPathForBackendRole(role: string | undefined): string {
    const r = (role ?? "STUDENT").toUpperCase();
    if (r === "ADMIN") return "/admin/settings";
    if (r === "INSTRUCTOR") return "/instructor/settings";
    return "/dashboard/settings";
}

/** Coerce API/persisted role string to a known backend role (defaults STUDENT). */
export function asBackendRole(r: string | undefined): BackendRole {
    const x = (r ?? "STUDENT").toUpperCase();
    if (x === "ADMIN" || x === "INSTRUCTOR" || x === "STUDENT") return x;
    return "STUDENT";
}

/** Where to send a signed-in user after login or password change. */
export function postAuthRedirectPath(user: { role: string; mustChangePassword?: boolean } | null | undefined): string {
    if (!user) return ROUTES.LOGIN;
    if (user.mustChangePassword) return ROUTES.CHANGE_PASSWORD;
    return dashboardPathForBackendRole(asBackendRole(user.role));
}

export function roleLabelForBackendRole(role: string | undefined): string {
    const r = (role ?? "STUDENT").toUpperCase();
    if (r === "ADMIN") return "Administrator";
    if (r === "INSTRUCTOR") return "Instructor";
    return "Student";
}

/** Legacy UI role → home (TEACHER maps to instructor dashboard). */
export const roleHomePath = (role: Role): string => {
    switch (role) {
        case "ADMIN":
            return ROUTES.ADMIN_DASHBOARD;
        case "TEACHER":
            return ROUTES.TEACHER_DASHBOARD;
        case "STUDENT":
        default:
            return ROUTES.STUDENT_DASHBOARD;
    }
};
