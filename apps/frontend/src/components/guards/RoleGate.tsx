import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { ROUTES } from "@/lib/route-paths";
import { PageLoadingSkeleton } from "@/components/ui/PageSkeleton";
import { asBackendRole, postAuthRedirectPath, type BackendRole } from "@/utils/auth";

type RoleGateProps = {
    allowed: readonly BackendRole[];
    children: ReactNode;
};

/** Requires signed-in user whose role is in `allowed`; otherwise redirects to login or role home. */
export function RoleGate({ allowed, children }: RoleGateProps) {
    const user = useAuthStore((s) => s.user);
    const isLoading = useAuthStore((s) => s.isLoading);

    if (isLoading) {
        return <PageLoadingSkeleton />;
    }

    if (!user) {
        return <Navigate to={ROUTES.LOGIN} replace />;
    }

    if (user.mustChangePassword) {
        return <Navigate to={ROUTES.CHANGE_PASSWORD} replace />;
    }

    const role = asBackendRole(user.role);
    if (!allowed.includes(role)) {
        return <Navigate to={postAuthRedirectPath(user)} replace />;
    }

    return <>{children}</>;
}
