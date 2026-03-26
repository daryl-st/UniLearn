import { Link } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

export default function AdminDashboardPage() {
  const { user, logout } = useAuthStore();

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="border-b border-border bg-card/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">UniLearn</p>
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:inline">Welcome, {user?.name}</span>
            <Link className="rounded-md border border-border px-3 py-1.5 text-sm" to='/'>
              Home
            </Link>
            <button
              type="button"
              onClick={logout}
              className="cursor-pointer rounded-md bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">
        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-2xl font-bold">Welcome, Admin</h2>
          <p className="mt-2 text-muted-foreground">Manage platform users and teacher onboarding.</p>
          <Link
            to="/assignIns"
            className="mt-5 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            Register New Teacher
          </Link>
        </section>
      </main>
    </div>
  );
}
