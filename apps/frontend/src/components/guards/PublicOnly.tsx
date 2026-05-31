import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { postAuthRedirectPath } from "@/utils/auth";
import { ROUTES } from "@/lib/route-paths";

export function PublicOnly() {
    const user = useAuthStore((s) => s.user);

    if (user) {
        if (user.mustChangePassword) {
            return <Navigate to={ROUTES.CHANGE_PASSWORD} replace />;
        }
        return <Navigate to={postAuthRedirectPath(user)} replace />;
    }

    return <Outlet />;
}
