import React from 'react';

interface CourseSkeletonGridProps {
  count?: number;
  columns?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
}

export const CourseSkeletonGrid: React.FC<CourseSkeletonGridProps> = ({ 
  count = 6,
  columns = { sm: 1, md: 2, lg: 3, xl: 4 }
}) => {
  // Determine grid columns based on screen size
  const gridCols = `
    grid 
    grid-cols-1 
    ${columns.sm === 1 ? 'sm:grid-cols-1' : `sm:grid-cols-${columns.sm}`}
    ${columns.md === 2 ? 'md:grid-cols-2' : `md:grid-cols-${columns.md}`}
    ${columns.lg === 3 ? 'lg:grid-cols-3' : `lg:grid-cols-${columns.lg}`}
    ${columns.xl === 4 ? 'xl:grid-cols-4' : `xl:grid-cols-${columns.xl}`}
    gap-6
  `;

  return (
    <div className={gridCols}>
      {Array.from({ length: count }).map((_, index) => (
        <CourseSkeleton key={index} />
      ))}
    </div>
  );
};

export const CourseSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-200"></div>
      <div className="p-6">
        <div className="h-6 bg-gray-200 rounded mb-2 w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded mb-4 w-1/4"></div>
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
        <div className="flex justify-between items-center mb-4">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
        </div>
        <div className="h-10 bg-gray-200 rounded w-full"></div>
      </div>
    </div>
  );
};