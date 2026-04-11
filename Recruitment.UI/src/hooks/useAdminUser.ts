// src/hooks/useAdminUser.ts
import { useState, useCallback } from 'react';
import { message } from 'antd';
import { AdminUser, AdminUserFilter } from '../types/adminUser';
import AdminUserService from '../services/adminUserService';

export interface UseAdminUserResult {
    users: AdminUser[];
    loading: boolean;
    error: string | null;
    fetchUsers: (filter?: AdminUserFilter) => Promise<void>;
    toggleStatus: (id: number) => Promise<boolean>;
}

/**
 * Custom hook quản lý danh sách Users cho Admin
 */
const useAdminUser = (): UseAdminUserResult => {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchUsers = useCallback(async (filter?: AdminUserFilter) => {
        setLoading(true);
        setError(null);
        try {
            const response = await AdminUserService.getAllUsers(filter);
            setUsers(response.data);
        } catch (err: any) {
            const errorMsg = 'Không thể tải danh sách người dùng!';
            setError(errorMsg);
            message.error(errorMsg);
        } finally {
            setLoading(false);
        }
    }, []);

    // PATCH: Khóa/Mở khóa tài khoản
    const toggleStatus = useCallback(async (id: number): Promise<boolean> => {
        try {
            await AdminUserService.toggleStatus(id);
            message.success('Cập nhật trạng thái tài khoản thành công!');
            // Không truyền filter cũ vào fetchUsers ở đây để đơn giản, 
            // hoặc có thể gọi lại trigger fetch từ component. 
            // Ở đây trả về true để component tự gọi handleSearch/fetch.
            return true;
        } catch (err: any) {
            console.error('Lỗi khi cập nhật trạng thái:', err);
            message.error('Không thể cập nhật trạng thái tài khoản lúc này!');
            return false;
        }
    }, []);

    return {
        users,
        loading,
        error,
        fetchUsers,
        toggleStatus,
    };
};

export default useAdminUser;
