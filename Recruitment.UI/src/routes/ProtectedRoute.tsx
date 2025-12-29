import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../hooks/hook';

interface ProtectedRouteProps {
    allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
    // Lấy thêm isLoading để tránh redirect khi Redux đang load dữ liệu
    const { user, isLoading } = useAppSelector((state) => state.auth);

    // --- DEBUG LOGS (Bật F12 xem console khi chạy) ---
    // console.log("--- Check Quyền ---");
    // console.log("User hiện tại:", user);
    // console.log("Role cần có:", allowedRoles);
    // -----------------------------------------------

    // 1. Nếu đang loading dữ liệu từ API/LocalStorage -> Chưa làm gì cả (hoặc hiện Loading Spinner)
    // Nếu không có dòng này, lúc F5 trang web có thể bị nháy về trang Login
    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">Đang tải...</div>;
    }

    // 2. Kiểm tra đăng nhập
    if (!user) {
        // Chưa đăng nhập -> Đá về Login
        return <Navigate to="/login" replace />;
    }

    // 3. Kiểm tra quyền (Role)
    if (allowedRoles) {
        // QUAN TRỌNG: Dùng Number() để ép kiểu user.roleId thành số
        // Vì đôi khi API trả về "1" (string) mà Role.Admin lại là 1 (number)
        const userRole = (user.role);

        if (!allowedRoles.includes(userRole)) {
            // Đã đăng nhập nhưng không đủ quyền -> Đá về trang Unauthorized
            // (Đảm bảo bạn đã khai báo route "/unauthorized" trong AppRoutes)
            return <Navigate to="/unauthorized" replace />;
        }
    }

    // 4. Hợp lệ -> Cho phép đi tiếp
    return <Outlet />;
};

export default ProtectedRoute;