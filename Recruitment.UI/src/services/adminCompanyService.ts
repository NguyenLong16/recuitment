import axiosClient from "./axiosClient";
import { AdminCompany } from "../types/adminCompany";

const AdminCompanyService = {
    // GET: Lấy danh sách tất cả các công ty (Admin)
    getAllCompanies: (keyword?: string) => {
        const params: any = {};
        if (keyword) params.keyword = keyword;
        return axiosClient.get<AdminCompany[]>('/AdminCompany', { params });
    },
};

export default AdminCompanyService;
