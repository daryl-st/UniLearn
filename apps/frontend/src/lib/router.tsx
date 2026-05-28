import { Navigate, Route, Routes, useParams } from "react-router-dom";
import { lazy, Suspense } from "react";
import { useAuthStore } from "@/stores/authStore";
import { asBackendRole, dashboardPathForBackendRole } from "@/utils/auth";
import { RoleGate } from "@/components/guards/RoleGate";

// Auth pages
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'));

// shared page
const AppLayout = lazy(() => import('@/components/layout/AppLayout'));
const NotFoundPage = lazy(() => import('@/pages/shared/NotFoundPage'));
// const UnauthorizedPage = lazy(() => import('@/pages/shared/UnauthorizedPage'));

// public pages
const LandingPage = lazy(() => import('@/pages/public/LandingPage'));
const AboutPage = lazy(() => import('@/pages/public/AboutPage'));
const ContactPage = lazy(() => import('@/pages/public/ContactPage'));
const CoursesPage = lazy(() => import('@/pages/public/CoursePage'));

// let's have the private pages here - Student pages first
const StudnetDashboardPage = lazy(() => import('@/pages/student/Dashboard'));
const CourseDetail = lazy(() => import('@/pages/student/CourseDetail'));
const LearningWorkspace = lazy(() => import('@/pages/student/LearningWorkspace'));
const CourseExplorer = lazy(() => import('@/pages/student/CourseExplorer'));

// needs better implementation
function LearningCourseRedirect() {
  const { courseId } = useParams<{ courseId: string }>();
  if (!courseId) return <Navigate to="/dashboard/courses" replace />;
  return <Navigate to={`/dashboard/courses/${courseId}`} replace />;
}

function LearningRootRedirect() {
  return <Navigate to="/dashboard/courses" replace />;
}
// Instructor Pages
const InstructorDashboardPage = lazy(() => import('@/pages/instructor/Dashboard').then((module) => ({ default: module.Dashboard })));
const InstructorCourseManagementPage = lazy(() => import('@/pages/instructor/CourseManagement').then((module) => ({ default: module.CourseManagement })));
const InstructorAnalyticsPage = lazy(() => import('@/pages/instructor/Analytics').then((module) => ({ default: module.Analytics })));
const InstructorContentLibraryPage = lazy(() => import('@/pages/instructor/ContentLibrary').then((module) => ({ default: module.ContentLibrary })));
const InstructorSettingsPage = lazy(() => import('@/pages/instructor/Setting').then((module) => ({ default: module.Settings })));
// Admin Pages
const AdminDashboardPage = lazy(() => import('@/pages/admin/Dashboard').then((module) => ({ default: module.Dashboard })));
const AdminCourseManagementPage = lazy(() => import('@/pages/admin/CourseMangement').then((module) => ({ default: module.CourseManagement })));
const AdminAnalyticsPage = lazy(() => import('@/pages/admin/Analytics').then((module) => ({ default: module.Analytics })));
const AdminSettingsPage = lazy(() => import('@/pages/admin/Settings').then((module) => ({ default: module.Settings })));
const AdminUserManagementPage = lazy(() => import('@/pages/admin/UserManagement').then((module) => ({ default: module.UserManagement })));

function DashboardDemoPage({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="p-8 md:p-10">
      <section className="rounded-sm border border-outline-variant/10 bg-surface-low p-8 shadow-[0_20px_40px_rgba(0,0,0,0.18)]">
        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-on-surface-variant">
          Demo route
        </p>
        <h1 className="mt-3 font-headline text-3xl font-bold text-white">{title}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-on-surface-variant">
          {description}
        </p>
        <div className="mt-8 inline-flex items-center rounded-sm border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-medium text-primary">
          This section is a placeholder for the next iteration.
        </div>
      </section>
    </div>
  );
}

// function ProtectedRoute({ children }: { children: React.ReactNode }) {
//   const user = useAuthStore((state) => state.user);
//   const isLoading = useAuthStore((state) => state.isLoading);

//   // TODO: refactor
//   if (isLoading) {
//     return <div>Loading...</div> // loading component
//   }

//   if (!user) {
//     return <Navigate to="/login" replace />
//   }

//   return children;
// }

// Public Route Components
// redirect to dashboard of already logged in
function PublicRoute({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);

  if (isLoading) return <div>Loading...</div>;

  if (user) return <Navigate to={dashboardPathForBackendRole(asBackendRole(user.role))} replace />;

  return children;
}

type RouteEntry = {
  path: string;
  element: React.ReactNode;
};

const publicRoutes: RouteEntry[] = [
  { path: '/', element: <LandingPage /> },
  { path: '/about', element: <AboutPage /> },
  { path: '/contact', element: <ContactPage /> },
  { path: '/courses', element: <CoursesPage /> },
  {
    path: '/login',
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },
  {
    path: '/register',
    element: (
      <PublicRoute>
        <RegisterPage />
      </PublicRoute>
    ),
  },
];

const protectedRoutes: RouteEntry[] = [
  {
    path: '/dashboard',
    element: (
      <RoleGate allowed={['STUDENT']}>
        <StudnetDashboardPage />
      </RoleGate>
    ),
  },
  {
    path: '/dashboard/courses/:courseId',
    element: (
      <RoleGate allowed={['STUDENT']}>
        <CourseDetail />
      </RoleGate>
    ),
  },
  {
    path: '/dashboard/courses',
    element: (
      <RoleGate allowed={['STUDENT']}>
        <CourseExplorer />
      </RoleGate>
    ),
  },
  {
    path: '/dashboard/learning/:courseId/:resourceId',
    element: (
      <RoleGate allowed={['STUDENT']}>
        <LearningWorkspace />
      </RoleGate>
    ),
  },
  {
    path: '/dashboard/learning/:courseId',
    element: (
      <RoleGate allowed={['STUDENT']}>
        <LearningCourseRedirect />
      </RoleGate>
    ),
  },
  {
    path: '/dashboard/learning',
    element: (
      <RoleGate allowed={['STUDENT']}>
        <LearningRootRedirect />
      </RoleGate>
    ),
  },
  {
    path: '/dashboard/analytics',
    element: (
      <RoleGate allowed={['STUDENT']}>
        <DashboardDemoPage
          title="Analytics"
          description="This demo route will eventually show progress breakdowns, course completion charts, and cohort trends."
        />
      </RoleGate>
    ),
  },
  {
    path: '/dashboard/ai-tools',
    element: (
      <RoleGate allowed={['STUDENT']}>
        <DashboardDemoPage
          title="AI Tools"
          description="This demo route will host assistants, prompt labs, and course generation tools."
        />
      </RoleGate>
    ),
  },
  {
    path: '/dashboard/settings',
    element: (
      <RoleGate allowed={['STUDENT']}>
        <DashboardDemoPage
          title="Settings"
          description="This demo route will contain profile preferences, workspace options, and notification controls."
        />
      </RoleGate>
    ),
  },
  { path: '/instructor', element: <Navigate to="/instructor/dashboard" replace /> },
  {
    path: '/instructor/dashboard',
    element: (
      <RoleGate allowed={['INSTRUCTOR']}>
        <InstructorDashboardPage />
      </RoleGate>
    ),
  },
  {
    path: '/instructor/courses',
    element: (
      <RoleGate allowed={['INSTRUCTOR']}>
        <InstructorCourseManagementPage />
      </RoleGate>
    ),
  },
  {
    path: '/instructor/content',
    element: (
      <RoleGate allowed={['INSTRUCTOR']}>
        <InstructorContentLibraryPage />
      </RoleGate>
    ),
  },
  {
    path: '/instructor/analytics',
    element: (
      <RoleGate allowed={['INSTRUCTOR']}>
        <InstructorAnalyticsPage />
      </RoleGate>
    ),
  },
  {
    path: '/instructor/settings',
    element: (
      <RoleGate allowed={['INSTRUCTOR']}>
        <InstructorSettingsPage />
      </RoleGate>
    ),
  },
  { path: '/admin', element: <Navigate to="/admin/dashboard" replace /> },
  {
    path: '/admin/dashboard',
    element: (
      <RoleGate allowed={['ADMIN']}>
        <AdminDashboardPage />
      </RoleGate>
    ),
  },
  {
    path: '/admin/users',
    element: (
      <RoleGate allowed={['ADMIN']}>
        <AdminUserManagementPage />
      </RoleGate>
    ),
  },
  {
    path: '/admin/courses',
    element: (
      <RoleGate allowed={['ADMIN']}>
        <AdminCourseManagementPage />
      </RoleGate>
    ),
  },
  {
    path: '/admin/analytics',
    element: (
      <RoleGate allowed={['ADMIN']}>
        <AdminAnalyticsPage />
      </RoleGate>
    ),
  },
  {
    path: '/admin/settings',
    element: (
      <RoleGate allowed={['ADMIN']}>
        <AdminSettingsPage />
      </RoleGate>
    ),
  },
];

export function AppRouter() {
  // TODO: needs refactoring
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AppLayout>
        <Routes>
          {publicRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}

          {/* Public Routes */}
          {/* <Route path="/login" element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          } />
          <Route path="/register" element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          } /> */}

          {/* For debugging purpose */}
          {protectedRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}

          {/* Protected Routes */}
          {/* <Route path="/dashboard" element={
            <PublicRoute>
              <InstructorDashboardPage />
            </PublicRoute>
          } />
          <Route path="/dashboard" element={
            <PublicRoute>
              <AdminDashboardPage />
            </PublicRoute>
          } /> */}

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AppLayout>
    </Suspense>
  )
}
