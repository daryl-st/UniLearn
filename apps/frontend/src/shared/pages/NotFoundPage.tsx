import { Link } from "react-router-dom";
import { ROUTES } from "@/app/route-paths";

export default function NotFoundPage() {
  return (
    <main className="grid min-h-dvh place-items-center bg-background px-6 text-foreground">
      <section className="w-full max-w-xl rounded-2xl border border-border bg-card p-8 text-center">
        <h1 className="text-3xl font-bold">404</h1>
        <p className="mt-3 text-muted-foreground">This page does not exist.</p>
        <Link
          to={ROUTES.HOME}
          className="mt-6 inline-flex rounded-lg border border-border bg-accent px-4 py-2 text-sm font-semibold"
        >
          Back to Home
        </Link>
      </section>
    </main>
  );
}
