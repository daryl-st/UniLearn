export function DashboardFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="flex h-12 shrink-0 items-center justify-between border-t border-outline-variant/10 bg-surface px-4 md:px-8">
      <p className="text-[11px] text-on-surface-variant">© {year} UniLearn</p>
      <div className="flex items-center gap-4">
        <a href="#" className="text-[11px] text-on-surface-variant hover:text-primary transition-colors">
          Privacy
        </a>
        <a href="#" className="text-[11px] text-on-surface-variant hover:text-primary transition-colors">
          Terms
        </a>
      </div>
    </footer>
  );
}
