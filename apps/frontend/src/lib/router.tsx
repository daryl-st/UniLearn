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

// let's have the private pages here
const StudnetDashboardPage = lazy(() => import('@/pages/student/Dashboard'));
const CourseDetail = lazy(() => import('@/pages/student/CourseDetail'));
const LearningWorkspace = lazy(() => import('@/pages/student/LearningWorkspace'));
const CourseExplorer = lazy(() => import('@/pages/student/CourseExplorer'));
const AnalyticsPage = lazy(() => import('@/pages/student/Analytics'));

// const StudnetDashboardPage = lazy(() => import('@/pages/dashboards/student/StudentDashboardPage'));
// const InstructorDashboardPage = lazy(() => import('@/pages/dashboards/instructor/TeacherDashboardPage'));
// const AdminDashboardPage = lazy(() => import('@/pages/dashboards/admin/AdminDashboardPage'));

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

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);

  // TODO: refactor
  if (isLoading) {
    return <div>Loading...</div> // loading component
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children;
}

// Public Route Components
// redirect to dashboard of already logged in
function PublicRoute({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);

  if (isLoading) return <div>Loading...</div>;

  if (user) return <Navigate to="/dashboard" replace />;

  return children;
}

export function AppRouter() {
  // TODO: needs refactoring
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AppLayout>
        <Routes>
          <Route path="/" element={<HomePage />}/>
          <Route path="/home" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/log" element={<LoginPageNew />} />
          <Route path="/reg" element={<RegisterPageNew />} />
          

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
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <StudnetDashboardPage />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/courses/:courseId" element={
            <ProtectedRoute>
              <CourseDetail />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/courses" element={
            <ProtectedRoute>
              <CourseExplorer />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/learning" element={
            <ProtectedRoute>
              <LearningWorkspace />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/analytics" element={
            <ProtectedRoute>
              <AnalyticsPage />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/ai-tools" element={
            <ProtectedRoute>
              <DashboardDemoPage
                title="AI Tools"
                description="This demo route will host assistants, prompt labs, and course generation tools."
              />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/settings" element={
            <ProtectedRoute>
              <DashboardDemoPage
                title="Settings"
                description="This demo route will contain profile preferences, workspace options, and notification controls."
              />
            </ProtectedRoute>
          } />

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
          <Route path="*" element={<NotFoundPage />} />
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
