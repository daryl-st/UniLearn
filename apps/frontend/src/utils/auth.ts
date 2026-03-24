import { ROUTES } from "@/lib/route-paths";
import type { Role } from "@/types/auth";

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
