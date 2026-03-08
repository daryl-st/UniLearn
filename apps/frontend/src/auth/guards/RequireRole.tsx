import { Navigate, Outlet } from "react-router-dom";
import { ROUTES } from "@/app/route-paths";
import type { Role } from "@/auth/types";
import { useAuth } from "@/auth/useAuth";

type RequireRoleProps = {
  allowed: Role[];
};

export function RequireRole({ allowed }: RequireRoleProps) {
  const { user } = useAuth();

  if (!user || !allowed.includes(user.role)) {
    return <Navigate to={ROUTES.UNAUTHORIZED} replace />;
  }

  return <Outlet />;
}
