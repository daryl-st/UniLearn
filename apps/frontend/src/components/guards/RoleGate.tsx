import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { ROUTES } from "@/lib/route-paths";
import { asBackendRole, dashboardPathForBackendRole, type BackendRole } from "@/utils/auth";

type RoleGateProps = {
    allowed: readonly BackendRole[];
    children: ReactNode;
};

/** Requires signed-in user whose role is in `allowed`; otherwise redirects to login or role home. */
export function RoleGate({ allowed, children }: RoleGateProps) {
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
        return <Navigate to={ROUTES.LOGIN} replace />;
    }

    const role = asBackendRole(user.role);
    if (!allowed.includes(role)) {
        return <Navigate to={dashboardPathForBackendRole(role)} replace />;
    }

    return <>{children}</>;
}
