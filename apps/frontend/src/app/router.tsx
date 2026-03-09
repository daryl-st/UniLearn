import { Navigate, Route, Routes } from "react-router-dom";
import { ROUTES } from "@/app/route-paths";
import { PublicOnly } from "@/auth/guards/PublicOnly";
import { RequireAuth } from "@/auth/guards/RequireAuth";
import { RequireRole } from "@/auth/guards/RequireRole";
import LoginPage from "@/auth/pages/LoginPage";
import RegisterPage from "@/auth/pages/RegisterPage";
import AdminDashboardPage from "@/dashboards/admin/AdminDashboardPage";
import AdminLayout from "@/dashboards/admin/AdminLayout";
import CreateTeacherPage from "@/dashboards/admin/CreateTeacherPage";
import StudentDashboardPage from "@/dashboards/student/StudentDashboardPage";
import StudentLayout from "@/dashboards/student/StudentLayout";
import TeacherDashboardPage from "@/dashboards/teacher/TeacherDashboardPage";
import TeacherLayout from "@/dashboards/teacher/TeacherLayout";
import HeroPage from "@/marketing/pages/HeroPage";
import NotFoundPage from "@/shared/pages/NotFoundPage";
import UnauthorizedPage from "@/shared/pages/UnauthorizedPage";

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
