import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { asBackendRole, dashboardPathForBackendRole } from "@/utils/auth";

export function PublicOnly() {
    const user = useAuthStore((s) => s.user);

    if (user) {
        return <Navigate to={dashboardPathForBackendRole(asBackendRole(user.role))} replace />;
    }

    return <Outlet />;
}
