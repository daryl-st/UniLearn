import { Link } from "react-router-dom";
import { ROUTES } from "@/app/route-paths";

export default function AdminDashboardPage() {
  return (
    <section className="rounded-2xl border border-border bg-card p-6">
      <h2 className="text-2xl font-bold">Welcome, Admin</h2>
      <p className="mt-2 text-muted-foreground">Manage platform users and teacher onboarding.</p>
      <Link
        to={ROUTES.ADMIN_CREATE_TEACHER}
        className="mt-5 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
      >
        Register New Teacher
      </Link>
    </section>
  );
}
