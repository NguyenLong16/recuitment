import axiosClient from "./axiosClient";
import { AdminUser, AdminUserFilter } from "../types/adminUser";

const AdminUserService = {
    // GET: Lấy danh sách tất cả users (Admin)
    getAllUsers: (filter?: AdminUserFilter) => {
        const params: any = {};
        if (filter?.keyword) params.keyword = filter.keyword;
        if (filter?.roleId !== undefined) params.roleId = filter.roleId;
        return axiosClient.get<AdminUser[]>('/admin/AdminUser', { params });
    },

    // PATCH: Khóa/Mở khóa tài khoản
    toggleStatus: (id: number) => {
        return axiosClient.patch(`/admin/AdminUser/${id}/toggle-status`);
    },
};

export default AdminUserService;
