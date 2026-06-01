interface CourseSkeletonGridProps {
  count?: number;
  columns?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
}

export const CourseSkeletonGrid = ({
  count = 6,
  columns = { sm: 1, md: 2, lg: 3, xl: 4 }
}: CourseSkeletonGridProps) => {
  const gridCols = `grid grid-cols-1 ${columns.sm === 1 ? 'sm:grid-cols-1' : `sm:grid-cols-${columns.sm}`} ${columns.md === 2 ? 'md:grid-cols-2' : `md:grid-cols-${columns.md}`} ${columns.lg === 3 ? 'lg:grid-cols-3' : `lg:grid-cols-${columns.lg}`} ${columns.xl === 4 ? 'xl:grid-cols-4' : `xl:grid-cols-${columns.xl}`} gap-6`;

  return (
    <div className={gridCols}>
      {Array.from({ length: count }).map((_, index) => (
        <CourseSkeleton key={index} />
      ))}
    </div>
  );
};

export const CourseSkeleton = () => {
  return (
    <div className="rounded-[1.5rem] border border-border/10 bg-surface-high overflow-hidden shadow-sm animate-pulse">
      <div className="h-56 bg-surface-low" />
      <div className="p-6 space-y-4">
        <div className="h-6 w-3/4 rounded-full bg-surface-low" />
        <div className="h-4 w-1/3 rounded-full bg-surface-low" />
        <div className="space-y-3">
          <div className="h-4 rounded-full bg-surface-low" />
          <div className="h-4 w-5/6 rounded-full bg-surface-low" />
        </div>
        <div className="flex items-center justify-between">
          <div className="h-4 w-1/3 rounded-full bg-surface-low" />
          <div className="h-10 w-24 rounded-full bg-surface-low" />
        </div>
      </div>
    </div>
  );
};