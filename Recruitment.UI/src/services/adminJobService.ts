import axiosClient from "./axiosClient";
import { AdminJob } from "../types/adminJob";

const AdminJobService = {
    // GET: Lấy danh sách tất cả Job (Admin)
    getAllJobs: (keyword?: string, status?: number) => {
        const params: any = {};
        if (keyword) params.keyword = keyword;
        if (status !== undefined && status !== -1) params.status = status; // -1 = Tất cả
        return axiosClient.get<AdminJob[]>('/Job/admin', { params });
    },

    // PATCH: Ẩn/Hiện Job
    toggleHide: (id: number) => {
        return axiosClient.patch(`/Job/${id}/toggle-hide`);
    },
};

export default AdminJobService;
