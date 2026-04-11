// src/hooks/useAdminJob.ts
import { useState, useCallback } from 'react';
import { message } from 'antd';
import { AdminJob } from '../types/adminJob';
import AdminJobService from '../services/adminJobService';

export interface UseAdminJobResult {
    jobs: AdminJob[];
    loading: boolean;
    error: string | null;
    fetchJobs: (keyword?: string, status?: number) => Promise<void>;
    toggleHideJob: (id: number) => Promise<boolean>;
}

/**
 * Custom hook quản lý danh sách Tin tuyển dụng (Job) cho Admin
 */
const useAdminJob = (): UseAdminJobResult => {
    const [jobs, setJobs] = useState<AdminJob[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchJobs = useCallback(async (keyword?: string, status?: number) => {
        setLoading(true);
        setError(null);
        try {
            const response = await AdminJobService.getAllJobs(keyword, status);
            setJobs(response.data);
        } catch (err: any) {
            const errorMsg = 'Không thể tải danh sách tin tuyển dụng!';
            setError(errorMsg);
            message.error(errorMsg);
        } finally {
            setLoading(false);
        }
    }, []);

    // PATCH: Ẩn/Hiện Job
    const toggleHideJob = useCallback(async (id: number): Promise<boolean> => {
        try {
            await AdminJobService.toggleHide(id);
            message.success('Cập nhật trạng thái bài viết thành công!');
            return true;
        } catch (err: any) {
            console.error('Lỗi khi cập nhật trạng thái:', err);
            message.error('Không thể cập nhật trạng thái bài viết lúc này!');
            return false;
        }
    }, []);

    return {
        jobs,
        loading,
        error,
        fetchJobs,
        toggleHideJob,
    };
};

export default useAdminJob;
