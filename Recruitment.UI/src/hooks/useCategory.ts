// src/hooks/useCategory.ts
import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import { Category, CreateCategoryRequest, UpdateCategoryRequest } from '../types/category';
import CategoryService from '../services/categoryService';

export interface UseCategoryResult {
    categories: Category[];
    loading: boolean;
    error: string | null;
    deletingId: number | null;
    submitting: boolean;
    refetch: () => Promise<void>;
    createCategory: (data: CreateCategoryRequest) => Promise<boolean>;
    updateCategory: (id: number, data: UpdateCategoryRequest) => Promise<boolean>;
    deleteCategory: (id: number) => Promise<boolean>;
}

/**
 * Custom hook quản lý CRUD ngành nghề (Category) cho Admin
 * Xử lý toàn bộ logic: fetch, create, update, delete + loading/error states
 */
const useCategory = (): UseCategoryResult => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // GET: Fetch danh sách ngành nghề
    const fetchCategories = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await CategoryService.getAllCategories();
            setCategories(response.data);
        } catch (err: any) {
            const errorMsg = err?.response?.data?.message || 'Không thể tải danh sách ngành nghề!';
            setError(errorMsg);
            message.error(errorMsg);
        } finally {
            setLoading(false);
        }
    }, []);

    // POST: Thêm mới ngành nghề
    const createCategory = useCallback(async (data: CreateCategoryRequest): Promise<boolean> => {
        setSubmitting(true);
        try {
            await CategoryService.createCategory(data);
            message.success('Thêm ngành nghề thành công!');
            await fetchCategories(); // Refresh danh sách
            return true;
        } catch (err: any) {
            const errorMsg = err?.response?.data?.message || 'Không thể thêm ngành nghề!';
            message.error(errorMsg);
            return false;
        } finally {
            setSubmitting(false);
        }
    }, [fetchCategories]);

    // PUT: Cập nhật ngành nghề
    const updateCategory = useCallback(async (id: number, data: UpdateCategoryRequest): Promise<boolean> => {
        setSubmitting(true);
        try {
            await CategoryService.updateCategory(id, data);
            message.success('Cập nhật ngành nghề thành công!');
            await fetchCategories(); // Refresh danh sách
            return true;
        } catch (err: any) {
            const errorMsg = err?.response?.data?.message || 'Không thể cập nhật ngành nghề!';
            message.error(errorMsg);
            return false;
        } finally {
            setSubmitting(false);
        }
    }, [fetchCategories]);

    // DELETE: Xoá ngành nghề
    const deleteCategory = useCallback(async (id: number): Promise<boolean> => {
        setDeletingId(id);
        try {
            await CategoryService.deleteCategory(id);
            message.success('Xoá ngành nghề thành công!');
            await fetchCategories();
            return true;
        } catch (err: any) {
            console.error('Lỗi khi xoá ngành nghề:', err?.response?.data);
            message.error('Không thể xoá ngành nghề! Ngành nghề này đang được sử dụng bởi tin tuyển dụng.');
            return false;
        } finally {
            setDeletingId(null);
        }
    }, [fetchCategories]);

    // Auto fetch khi mount
    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    return {
        categories,
        loading,
        error,
        deletingId,
        submitting,
        refetch: fetchCategories,
        createCategory,
        updateCategory,
        deleteCategory,
    };
};

export default useCategory;
