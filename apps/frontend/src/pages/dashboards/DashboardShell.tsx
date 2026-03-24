import { Link, Outlet, useNavigate } from "react-router-dom";
import { ROUTES } from "@/lib/route-paths";
import { useAuth } from "@/contextes/useAuth";

type DashboardShellProps = {
  title: string;
};

export default function DashboardShell({ title }: DashboardShellProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut();
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="border-b border-border bg-card/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">UniLearn</p>
            <h1 className="text-xl font-bold">{title}</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:inline">{user?.email}</span>
            <Link className="rounded-md border border-border px-3 py-1.5 text-sm" to={ROUTES.HOME}>
              Home
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="cursor-pointer rounded-md bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
