// src/hooks/useLocation.ts
import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import { Location, CreateLocationRequest, UpdateLocationRequest } from '../types/Location';
import LocationService from '../services/locationService';

export interface UseLocationResult {
    locations: Location[];
    loading: boolean;
    error: string | null;
    deletingId: number | null;
    submitting: boolean;
    refetch: () => Promise<void>;
    createLocation: (data: CreateLocationRequest) => Promise<boolean>;
    updateLocation: (id: number, data: UpdateLocationRequest) => Promise<boolean>;
    deleteLocation: (id: number) => Promise<boolean>;
}

/**
 * Custom hook quản lý CRUD địa điểm (Location) cho Admin
 * Xử lý toàn bộ logic: fetch, create, update, delete + loading/error states
 */
const useLocation = (): UseLocationResult => {
    const [locations, setLocations] = useState<Location[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // GET: Fetch danh sách địa điểm
    const fetchLocations = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await LocationService.getAllLocations();
            setLocations(response.data);
        } catch (err: any) {
            const errorMsg = err?.response?.data?.message || 'Không thể tải danh sách địa điểm!';
            setError(errorMsg);
            message.error(errorMsg);
        } finally {
            setLoading(false);
        }
    }, []);

    // POST: Thêm mới địa điểm
    const createLocation = useCallback(async (data: CreateLocationRequest): Promise<boolean> => {
        setSubmitting(true);
        try {
            await LocationService.createLocation(data);
            message.success('Thêm địa điểm thành công!');
            await fetchLocations();
            return true;
        } catch (err: any) {
            const errorMsg = err?.response?.data?.message || 'Không thể thêm địa điểm!';
            message.error(errorMsg);
            return false;
        } finally {
            setSubmitting(false);
        }
    }, [fetchLocations]);

    // PUT: Cập nhật địa điểm
    const updateLocation = useCallback(async (id: number, data: UpdateLocationRequest): Promise<boolean> => {
        setSubmitting(true);
        try {
            await LocationService.updateLocation(id, data);
            message.success('Cập nhật địa điểm thành công!');
            await fetchLocations();
            return true;
        } catch (err: any) {
            const errorMsg = err?.response?.data?.message || 'Không thể cập nhật địa điểm!';
            message.error(errorMsg);
            return false;
        } finally {
            setSubmitting(false);
        }
    }, [fetchLocations]);

    // DELETE: Xoá địa điểm
    const deleteLocation = useCallback(async (id: number): Promise<boolean> => {
        setDeletingId(id);
        try {
            await LocationService.deleteLocation(id);
            message.success('Xoá địa điểm thành công!');
            await fetchLocations();
            return true;
        } catch (err: any) {
            console.error('Lỗi khi xoá địa điểm:', err?.response?.data);
            message.error('Không thể xoá địa điểm! Địa điểm này đang được sử dụng bởi tin tuyển dụng.');
            return false;
        } finally {
            setDeletingId(null);
        }
    }, [fetchLocations]);

    // Auto fetch khi mount
    useEffect(() => {
        fetchLocations();
    }, [fetchLocations]);

    return {
        locations,
        loading,
        error,
        deletingId,
        submitting,
        refetch: fetchLocations,
        createLocation,
        updateLocation,
        deleteLocation,
    };
};

export default useLocation;
