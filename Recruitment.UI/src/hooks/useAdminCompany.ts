// src/hooks/useAdminCompany.ts
import { useState, useCallback } from 'react';
import { message } from 'antd';
import { AdminCompany } from '../types/adminCompany';
import AdminCompanyService from '../services/adminCompanyService';

export interface UseAdminCompanyResult {
    companies: AdminCompany[];
    loading: boolean;
    error: string | null;
    fetchCompanies: (keyword?: string) => Promise<void>;
}

/**
 * Custom hook quản lý danh sách Công ty cho Admin
 */
const useAdminCompany = (): UseAdminCompanyResult => {
    const [companies, setCompanies] = useState<AdminCompany[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCompanies = useCallback(async (keyword?: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await AdminCompanyService.getAllCompanies(keyword);
            setCompanies(response.data);
        } catch (err: any) {
            const errorMsg = 'Không thể tải danh sách công ty!';
            setError(errorMsg);
            message.error(errorMsg);
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        companies,
        loading,
        error,
        fetchCompanies,
    };
};

export default useAdminCompany;
