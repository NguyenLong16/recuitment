import axiosClient from "./axiosClient";
import { Category, CreateCategoryRequest, UpdateCategoryRequest } from "../types/category";

const CategoryService = {
    // GET: Lấy danh sách tất cả ngành nghề (Admin)
    getAllCategories: () => {
        return axiosClient.get<Category[]>('/Category/admin');
    },

    // POST: Thêm mới ngành nghề (Admin)
    createCategory: (data: CreateCategoryRequest) => {
        return axiosClient.post<Category>('/Category/admin', data);
    },

    // PUT: Cập nhật ngành nghề (Admin)
    updateCategory: (id: number, data: UpdateCategoryRequest) => {
        return axiosClient.put<Category>(`/Category/admin/${id}`, data);
    },

    // DELETE: Xoá ngành nghề theo ID (Admin)
    deleteCategory: (id: number) => {
        return axiosClient.delete(`/Category/admin/${id}`);
    },
};

export default CategoryService;
