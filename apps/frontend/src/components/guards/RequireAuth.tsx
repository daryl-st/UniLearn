import { Navigate, Outlet, useLocation } from "react-router-dom";
import { ROUTES } from "@/lib/route-paths";
import { useAuthStore } from "@/stores/authStore";

export function RequireAuth() {
    const user = useAuthStore((s) => s.user);
    const isLoading = useAuthStore((s) => s.isLoading);
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="flex min-h-[40vh] items-center justify-center text-on-surface-variant">
                Loading…
            </div>
        );
    }

    if (!user) {
        return <Navigate to={ROUTES.LOGIN} replace state={{ from: location }} />;
    }

    return <Outlet />;
}
