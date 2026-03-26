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

const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'));
const StudnetDashboardPage = lazy(() => import('@/pages/dashboards/student/StudentDashboardPage'));
const InstructorDashboardPage = lazy(() => import('@/pages/dashboards/instructor/TeacherDashboardPage'));
const AdminDashboardPage = lazy(() => import('@/pages/dashboards/admin/AdminDashboardPage'));
const NotFoundPage = lazy(() => import('@/pages/shared/NotFoundPage'));
// const UnauthorizedPage = lazy(() => import('@/pages/shared/UnauthorizedPage'));
const HomePage = lazy(() => import('@/pages/marketing/HeroPage'));

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
      <Routes>
        <Route path="/" element={<HomePage />}/>

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
          <PublicRoute>
            <StudnetDashboardPage />
          </PublicRoute>
        } />

        {/* Protected Routes */}
        {/* <Route path="/dashboard" element={
          <ProtectedRoute>
            <InstructorDashboardPage />
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <AdminDashboardPage />
          </ProtectedRoute>
        } /> */}

        {/* TODO: Redirect root to dashboard or login  */}
        <Route path="/" element={
          <Navigate to="/" replace />
        } />

        {/* 404 - Not Found  */}
        <Route path="*" element={
          <PublicRoute>
            <NotFoundPage />
          </PublicRoute>
        } />
      </Routes>
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
