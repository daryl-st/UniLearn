import { Navigate, Route, Routes } from "react-router-dom";
import { ROUTES } from "@/lib/route-paths";
import { PublicOnly } from "@/components/guards/PublicOnly";
import { RequireAuth } from "@/components/guards/RequireAuth";
import { RequireRole } from "@/components/guards/RequireRole";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import AdminDashboardPage from "@/pages/dashboards/admin/AdminDashboardPage";
import AdminLayout from "@/pages/dashboards/admin/AdminLayout";
import CreateTeacherPage from "@/pages/dashboards/admin/CreateTeacherPage";
import StudentDashboardPage from "@/pages/dashboards/student/StudentDashboardPage";
import StudentLayout from "@/pages/dashboards/student/StudentLayout";
import TeacherDashboardPage from "@/pages/dashboards/teacher/TeacherDashboardPage";
import TeacherLayout from "@/pages/dashboards/teacher/TeacherLayout";
import HeroPage from "@/pages/marketing/HeroPage";
import NotFoundPage from "@/pages/shared/NotFoundPage";
import UnauthorizedPage from "@/pages/shared/UnauthorizedPage";

export default function AppRouter() {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<HeroPage />} />

      <Route element={<PublicOnly />}>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
      </Route>

      <Route element={<RequireAuth />}>
        <Route element={<RequireRole allowed={["STUDENT"]} />}>
          <Route path={ROUTES.STUDENT_DASHBOARD} element={<StudentLayout />}>
            <Route index element={<StudentDashboardPage />} />
          </Route>
        </Route>

        <Route element={<RequireRole allowed={["TEACHER"]} />}>
          <Route path={ROUTES.TEACHER_DASHBOARD} element={<TeacherLayout />}>
            <Route index element={<TeacherDashboardPage />} />
          </Route>
        </Route>

        <Route element={<RequireRole allowed={["ADMIN"]} />}>
          <Route path={ROUTES.ADMIN_DASHBOARD} element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="teachers/new" element={<CreateTeacherPage />} />
          </Route>
        </Route>
      </Route>

      <Route path={ROUTES.UNAUTHORIZED} element={<UnauthorizedPage />} />
      <Route path="*" element={<NotFoundPage />} />
      <Route path="/dashboard" element={<Navigate replace to={ROUTES.HOME} />} />
    </Routes>
  );
}
