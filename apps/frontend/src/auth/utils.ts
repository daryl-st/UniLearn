import { ROUTES } from "@/app/route-paths";
import type { Role } from "@/auth/types";

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
