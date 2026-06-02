export function PageLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-surface px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-10">
        <div className="space-y-4 max-w-3xl">
          <div className="h-9 w-3/5 rounded-full bg-surface-low animate-pulse" />
          <div className="h-5 w-2/5 rounded-full bg-surface-low animate-pulse" />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="rounded-[1.75rem] border border-border/10 bg-surface-high p-6 shadow-sm">
              <div className="mb-6 h-5 w-2/5 rounded-full bg-surface-low animate-pulse" />
              <div className="mb-6 h-36 rounded-[1.5rem] bg-surface-low animate-pulse" />
              <div className="space-y-3">
                <div className="h-4 rounded-full bg-surface-low animate-pulse" />
                <div className="h-4 w-4/5 rounded-full bg-surface-low animate-pulse" />
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <div className="h-72 rounded-[1.75rem] bg-surface-low animate-pulse" />
          <div className="h-72 rounded-[1.75rem] bg-surface-low animate-pulse" />
        </div>
      </div>
    </div>
  );
}
