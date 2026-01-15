// src/routes/AppRoutes.tsx
import { lazy, Suspense } from "react";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAppSelector } from "../hooks/hook";
import { Role } from "../types/auth";
const RegisterPage = lazy(() => import("../pages/auth/RegisterPage"));
const LoginPage = lazy(() => import("../pages/auth/LoginPage"));
const MainLayout = lazy(() => import("../components/layouts/client/MainLayout"));
const ProtectedRoute = lazy(() => import("./ProtectedRoute"));
const AdminLayout = lazy(() => import("../components/layouts/admin/AdminLayout"));
const Dashboard = lazy(() => import("../pages/admin/Dashboard"));
const HRDashboard = lazy(() => import("../pages/HR/HRDashboard"));
const HRLayout = lazy(() => import("../components/layouts/hr/HRLayout"));
const HomePage = lazy(() => import("../pages/client/HomePage"));
const JobManagement = lazy(() => import("../pages/HR/JobManagement"));
const JobForm = lazy(() => import("../pages/HR/JobForm"));
const ApplicationManagement = lazy(() => import("../pages/HR/ApplicationManagement"));
const AllApplicationsManagement = lazy(() => import("../pages/HR/AllApplicationsManagement"));
const JobDetailPage = lazy(() => import("../pages/client/JobDetailPage"));
const ApplicationHistoryPage = lazy(() => import("../pages/client/ApplicationHistoryPage"));
const HRProfilePage = lazy(() => import("../pages/HR/HRProfilePage"));
const MyProfilePage = lazy(() => import("../pages/client/MyProfilePage"));

// Component để redirect dựa trên role của user
const RoleBasedRedirect = () => {
    const { user, isLoading } = useAppSelector((state) => state.auth);

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">Đang tải...</div>;
    }

    // Nếu chưa đăng nhập hoặc là Candidate -> hiển thị HomePage
    if (!user || user.role === Role.Candidate) {
        return <HomePage />;
    }

    // Admin -> redirect to admin dashboard
    if (user.role === Role.Admin) {
        return <Navigate to="/admin/dashboard" replace />;
    }

    // Employer/HR -> redirect to HR dashboard
    if (user.role === Role.Employer) {
        return <Navigate to="/hr/dashboard" replace />;
    }

    // Fallback: hiển thị HomePage
    return <HomePage />;
};

const AppRoutes = () => {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <Routes>
                {/* --- PUBLIC ROUTES (Không cần đăng nhập) --- */}
                {/* Những trang này không nằm trong MainLayout hoặc nằm trong Layout riêng (như AuthLayout) */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                {/* <Route path="/404" element={<NotFound />} /> */}

                {/* --- CANDIDATE / USER ROUTES (Dùng MainLayout) --- */}
                {/* MainLayout chứa Navbar công khai, Footer... */}
                <Route element={<MainLayout />}>
                    <Route path="/" element={<RoleBasedRedirect />} />
                    {/* <Route path="/jobs/:id" element={<JobDetail />} /> */}
                    {/* Nếu user cần đăng nhập mới xem được hồ sơ cá nhân */}
                    <Route element={<ProtectedRoute allowedRoles={[Role.Candidate]} />}>
                        <Route path="/job/:id" element={<JobDetailPage />} />
                        <Route path="/my-applications" element={<ApplicationHistoryPage />} />
                        <Route path="/profile/:id" element={<HRProfilePage />} />
                        <Route path="/my-profile" element={<MyProfilePage />} />
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
                        <Route path="/hr/jobs-management" element={<JobManagement />} />
                        <Route path="/hr/applications/:jobId" element={<ApplicationManagement />} />
                        <Route path="/hr/candidate-management" element={<AllApplicationsManagement />} />
                        <Route path="/hr/post-job" element={<JobForm />} />
                        <Route path="/hr/edit-job/:id" element={<JobForm />} />
                        <Route path="/hr/my-profile" element={<MyProfilePage />} />
                    </Route>
                </Route>

                {/* Catch all - Chuyển về 404 */}
                <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
        </Suspense>
    );
};

export default AppRoutes;