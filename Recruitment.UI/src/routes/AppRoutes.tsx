// src/routes/AppRoutes.tsx

import { Navigate, Route, Routes } from "react-router-dom";
import RegisterPage from "../pages/auth/RegisterPage";
import MainLayout from "../components/layouts/client/MainLayout";
import ProtectedRoute from "./ProtectedRoute";
import { Role } from "../types/auth";
import AdminLayout from "../components/layouts/admin/AdminLayout";
import Dashboard from "../pages/admin/Dashboard";
import HRDashboard from "../pages/HR/HRDashboard";
import HRLayout from "../components/layouts/hr/HRLayout";
import LoginPage from "../pages/auth/LoginPage";
import HomePage from "../pages/client/HomePage";

const AppRoutes = () => {
    return (
        <Routes>
            {/* --- PUBLIC ROUTES (Không cần đăng nhập) --- */}
            {/* Những trang này không nằm trong MainLayout hoặc nằm trong Layout riêng (như AuthLayout) */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            {/* <Route path="/404" element={<NotFound />} /> */}

            {/* --- CANDIDATE / USER ROUTES (Dùng MainLayout) --- */}
            {/* MainLayout chứa Navbar công khai, Footer... */}
            <Route element={<MainLayout />}>
                <Route path="/" element={<HomePage />} />
                {/* <Route path="/jobs/:id" element={<JobDetail />} /> */}
                {/* Nếu user cần đăng nhập mới xem được hồ sơ cá nhân */}
                <Route element={<ProtectedRoute allowedRoles={[Role.Candidate]} />}>
                    {/* Thêm các route cá nhân của ứng viên tại đây */}
                </Route>
            </Route>


            {/* --- ADMIN ROUTES (Dùng AdminLayout + ProtectedRoute) --- */}
            <Route element={<ProtectedRoute allowedRoles={[Role.Admin]} />}>
                <Route element={<AdminLayout />}>
                    <Route path="/admin/dashboard" element={<Dashboard />} />
                    {/* <Route path="/admin/users" element={<UserManagement />} /> */}
                </Route>
            </Route>


            {/* --- HR / EMPLOYER ROUTES (Dùng HRLayout + ProtectedRoute) --- */}
            <Route element={<ProtectedRoute allowedRoles={[Role.Employer]} />}>
                <Route element={<HRLayout />}>
                    <Route path="/hr/dashboard" element={<HRDashboard />} />
                    {/* <Route path="/hr/post-job" element={<PostJob />} /> */}
                    {/* <Route path="/hr/candidates" element={<CandidateList />} /> */}
                </Route>
            </Route>

            {/* Catch all - Chuyển về 404 */}
            <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
    );
};

export default AppRoutes;