import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contextes/useAuth";
import { roleHomePath } from "@/utils/auth";

export function PublicOnly() {
  const { user } = useAuth();

  if (user) {
    return <Navigate to={roleHomePath(user.role)} replace />;
  }

  return <Outlet />;
}
