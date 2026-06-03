/** Central route path constants for guards, redirects, and links. */
export const ROUTES = {
    LOGIN: "/login",
    REGISTER: "/register",
    STUDENT_DASHBOARD: "/dashboard",
    TEACHER_DASHBOARD: "/instructor/dashboard",
    ADMIN_DASHBOARD: "/admin/dashboard",
    UNAUTHORIZED: "/unauthorized",
    CHANGE_PASSWORD: "/change-password",
} as const;

export type RouteKey = keyof typeof ROUTES;
