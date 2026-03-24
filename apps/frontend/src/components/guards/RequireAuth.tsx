import { Navigate, Outlet, useLocation } from "react-router-dom";
import { ROUTES } from "@/lib/route-paths";
import { useAuth } from "@/contextes/useAuth";

export function RequireAuth() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace state={{ from: location }} />;
  }

  return <Outlet />;
}
