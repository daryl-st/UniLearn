import { Navigate, Route, Routes } from "react-router-dom";
// import { ROUTES } from "@/lib/route-paths";
// import { PublicOnly } from "@/components/guards/PublicOnly";
// import { RequireAuth } from "@/components/guards/RequireAuth";
// import { RequireRole } from "@/components/guards/RequireRole";
// import LoginPage from "@/pages/auth/LoginPage";
// import RegisterPage from "@/pages/auth/RegisterPage";
// import AdminDashboardPage from "@/pages/dashboards/admin/AdminDashboardPage";
// import AdminLayout from "@/pages/dashboards/admin/AdminLayout";
// import CreateTeacherPage from "@/pages/dashboards/admin/CreateTeacherPage";
// import StudentDashboardPage from "@/pages/dashboards/student/StudentDashboardPage";
// import StudentLayout from "@/pages/dashboards/student/StudentLayout";
// import TeacherDashboardPage from "@/pages/dashboards/teacher/TeacherDashboardPage";
// import TeacherLayout from "@/pages/dashboards/teacher/TeacherLayout";
// import HeroPage from "@/pages/marketing/HeroPage";
// import NotFoundPage from "@/pages/shared/NotFoundPage";
// import UnauthorizedPage from "@/pages/shared/UnauthorizedPage";

import { lazy, Suspense } from "react";
import { useAuthStore } from "@/stores/authStore";

// Auth pages
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'));
const LoginPageNew = lazy(() => import('@/pages/public/LoginPage'));
const RegisterPageNew = lazy(() => import('@/pages/public/RegitsterPage'));

// shared page
const AppLayout = lazy(() => import('@/components/layout/AppLayout'));
const NotFoundPage = lazy(() => import('@/pages/shared/NotFoundPage'));
// const UnauthorizedPage = lazy(() => import('@/pages/shared/UnauthorizedPage'));

// public pages
const HomePage = lazy(() => import('@/pages/marketing/HeroPage'));
const LandingPage = lazy(() => import('@/pages/public/LandingPage'));
const AboutPage = lazy(() => import('@/pages/public/AboutPage'));
const ContactPage = lazy(() => import('@/pages/public/ContactPage'));
const CoursesPage = lazy(() => import('@/pages/public/CoursePage'));

// let's have the private pages here - Student pages first
const StudnetDashboardPage = lazy(() => import('@/pages/student/Dashboard'));
const CourseDetail = lazy(() => import('@/pages/student/CourseDetail'));
const LearningWorkspace = lazy(() => import('@/pages/student/LearningWorkspace'));
const CourseExplorer = lazy(() => import('@/pages/student/CourseExplorer'));
const AnalyticsPage = lazy(() => import('@/pages/student/Analytics'));
const AIToolPage = lazy(() => import('@/pages/student/AITool'));
const SettingsPage = lazy(() => import('@/pages/student/Setting'));
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

// const StudnetDashboardPage = lazy(() => import('@/pages/dashboards/student/StudentDashboardPage'));
// const InstructorDashboardPage = lazy(() => import('@/pages/dashboards/instructor/TeacherDashboardPage'));
// const AdminDashboardPage = lazy(() => import('@/pages/dashboards/admin/AdminDashboardPage'));

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

  if (user) return <Navigate to="/dashboard" replace />;

  return children;
}

type RouteEntry = {
  path: string;
  element: React.ReactNode;
};

const publicRoutes: RouteEntry[] = [
  { path: '/', element: <HomePage /> },
  { path: '/home', element: <LandingPage /> },
  { path: '/about', element: <AboutPage /> },
  { path: '/contact', element: <ContactPage /> },
  { path: '/courses', element: <CoursesPage /> },
  { path: '/log', element: <LoginPageNew /> },
  { path: '/reg', element: <RegisterPageNew /> },
];

const protectedRoutes: RouteEntry[] = [
  {
    path: '/dashboard',
    element: <StudnetDashboardPage />,
  },
  {
    path: '/dashboard/courses/:courseId',
    element: <CourseDetail />,
  },
  {
    path: '/dashboard/courses',
    element: <CourseExplorer />,
  },
  {
    path: '/dashboard/learning',
    element: <LearningWorkspace />,
  },
  {
    path: '/dashboard/analytics',
    element: <AnalyticsPage />,
  },
  {
    path: '/dashboard/ai-tools',
    element: <AIToolPage />,
  },
  {
    path: '/dashboard/settings',
    element: <SettingsPage />,
  },
  // instructor pages here
  { path: '/instructor', element: <Navigate to="/instructor/dashboard" replace /> },
  { path: '/instructor/dashboard', element: <InstructorDashboardPage /> },
  { path: '/instructor/courses', element: <InstructorCourseManagementPage /> },
  { path: '/instructor/content', element: <InstructorContentLibraryPage /> },
  { path: '/instructor/analytics', element: <InstructorAnalyticsPage /> },
  { path: '/instructor/settings', element: <InstructorSettingsPage /> },
  // admin pages here (same style grouping as instructor routes)
  { path: '/admin', element: <Navigate to="/admin/dashboard" replace /> },
  { path: '/admin/dashboard', element: <AdminDashboardPage /> },
  { path: '/admin/users', element: <AdminUserManagementPage /> },
  { path: '/admin/courses', element: <AdminCourseManagementPage /> },
  { path: '/admin/analytics', element: <AdminAnalyticsPage /> },
  { path: '/admin/settings', element: <AdminSettingsPage /> },
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
          <Route path="/login" element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          } />
          <Route path="/register" element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          } />

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

          {/* 404 - Not Found  */}
          <Route path="*" element={
            <PublicRoute>
              <NotFoundPage />
            </PublicRoute>
          } />
        </Routes>
      </AppLayout>
    </Suspense>
  )
}

// export default function AppRouter() {
//   return (
//     <Routes>
//       <Route path={ROUTES.HOME} element={<HeroPage />} />

//       <Route element={<PublicOnly />}>
//         <Route path={ROUTES.LOGIN} element={<LoginPage />} />
//         <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
//       </Route>

//       <Route element={<RequireAuth />}>
//         <Route element={<RequireRole allowed={["STUDENT"]} />}>
//           <Route path={ROUTES.STUDENT_DASHBOARD} element={<StudentLayout />}>
//             <Route index element={<StudentDashboardPage />} />
//           </Route>
//         </Route>

//         <Route element={<RequireRole allowed={["TEACHER"]} />}>
//           <Route path={ROUTES.TEACHER_DASHBOARD} element={<TeacherLayout />}>
//             <Route index element={<TeacherDashboardPage />} />
//           </Route>
//         </Route>

//         <Route element={<RequireRole allowed={["ADMIN"]} />}>
//           <Route path={ROUTES.ADMIN_DASHBOARD} element={<AdminLayout />}>
//             <Route index element={<AdminDashboardPage />} />
//             <Route path="teachers/new" element={<CreateTeacherPage />} />
//           </Route>
//         </Route>
//       </Route>

//       <Route path={ROUTES.UNAUTHORIZED} element={<UnauthorizedPage />} />
//       <Route path="*" element={<NotFoundPage />} />
//       <Route path="/dashboard" element={<Navigate replace to={ROUTES.HOME} />} />
//     </Routes>
//   );
// }
