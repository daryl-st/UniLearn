import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/auth/useAuth";
import { roleHomePath } from "@/auth/utils";

export function PublicOnly() {
  const { user } = useAuth();

  if (user) {
    return <Navigate to={roleHomePath(user.role)} replace />;
  }

  return <Outlet />;
}
