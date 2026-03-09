import { Link } from "react-router-dom";
import { ROUTES } from "@/app/route-paths";

export default function HeroPage() {
  return (
    <main className="relative min-h-dvh overflow-hidden bg-background text-foreground">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(19,109,236,0.18),transparent_45%),radial-gradient(circle_at_80%_80%,_rgba(85,178,255,0.16),transparent_40%)]" />
      <section className="relative mx-auto flex min-h-dvh max-w-6xl flex-col justify-center gap-8 px-6 py-20 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">UniLearn Platform</p>
        <h1 className="max-w-3xl text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
          Learn smarter, teach faster, and manage your campus in one workspace.
        </h1>
        <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
          Students can create accounts directly, while teacher onboarding stays under admin control. Sign in to continue to your dedicated dashboard.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            to={ROUTES.REGISTER}
            className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Register as Student
          </Link>
          <Link
            to={ROUTES.LOGIN}
            className="rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
          >
            Login
          </Link>
        </div>
      </section>
    </main>
  );
}
