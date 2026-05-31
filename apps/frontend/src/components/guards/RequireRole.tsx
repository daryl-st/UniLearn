import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { ROUTES } from "@/lib/route-paths";
import { asBackendRole, postAuthRedirectPath, type BackendRole } from "@/utils/auth";

type RequireRoleProps = {
    allowed: readonly BackendRole[];
};

/** Layout route: requires auth + role in `allowed`, else redirect to login or role home. */
export function RequireRole({ allowed }: RequireRoleProps) {
    const user = useAuthStore((s) => s.user);
    const isLoading = useAuthStore((s) => s.isLoading);

    if (isLoading) {
        return (
            <div className="flex min-h-[40vh] items-center justify-center text-on-surface-variant">
                Loading…
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (user.mustChangePassword) {
        return <Navigate to={ROUTES.CHANGE_PASSWORD} replace />;
    }

    const role = asBackendRole(user.role);
    if (!allowed.includes(role)) {
        return <Navigate to={postAuthRedirectPath(user)} replace />;
    }

    return <Outlet />;
}
