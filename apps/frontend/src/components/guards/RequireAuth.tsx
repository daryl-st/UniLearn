import { Navigate, Outlet, useLocation } from "react-router-dom";
import { ROUTES } from "@/lib/route-paths";
import { useAuthStore } from "@/stores/authStore";
import { PageLoadingSkeleton } from "@/components/ui/PageSkeleton";

export function RequireAuth() {
    const user = useAuthStore((s) => s.user);
    const isLoading = useAuthStore((s) => s.isLoading);
    const location = useLocation();

    if (isLoading) {
        return <PageLoadingSkeleton />;
    }

    if (!user) {
        return <Navigate to={ROUTES.LOGIN} replace state={{ from: location }} />;
    }

    if (user.mustChangePassword && location.pathname !== ROUTES.CHANGE_PASSWORD) {
        return <Navigate to={ROUTES.CHANGE_PASSWORD} replace />;
    }

    return <Outlet />;
}
