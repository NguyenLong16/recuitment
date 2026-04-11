// src/hooks/useAdminReview.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { message } from 'antd';
import { AdminReview } from '../types/review';
import ReviewService from '../services/reviewService';

export interface UseAdminReviewResult {
    reviews: AdminReview[];
    loading: boolean;
    deletingId: number | null;
    keyword: string;
    ratingFilter: number | null;
    setKeyword: (kw: string) => void;
    setRatingFilter: (r: number | null) => void;
    refetch: () => Promise<void>;
    deleteReview: (id: number) => Promise<boolean>;
}

/**
 * Custom hook quản lý đánh giá (Review) cho Admin
 * Hỗ trợ lọc theo keyword (debounce 400ms) và rating
 */
const useAdminReview = (): UseAdminReviewResult => {
    const [reviews, setReviews] = useState<AdminReview[]>([]);
    const [loading, setLoading] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [keyword, setKeyword] = useState('');
    const [ratingFilter, setRatingFilter] = useState<number | null>(null);

    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    /** Fetch danh sách review từ server */
    const fetchReviews = useCallback(async (kw?: string, rating?: number | null) => {
        setLoading(true);
        try {
            const data = await ReviewService.getAdminReviews(
                kw || undefined,
                rating ?? undefined,
            );
            setReviews(data);
        } catch (err: any) {
            const msg = err?.response?.data?.message || 'Không thể tải danh sách đánh giá!';
            message.error(msg);
        } finally {
            setLoading(false);
        }
    }, []);

    /** Debounce khi keyword thay đổi */
    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            fetchReviews(keyword.trim(), ratingFilter);
        }, 400);
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [keyword, ratingFilter, fetchReviews]);

    /** Xoá review theo ID */
    const deleteReview = useCallback(async (id: number): Promise<boolean> => {
        setDeletingId(id);
        try {
            await ReviewService.deleteAdminReview(id);
            message.success('Xoá đánh giá thành công!');
            setReviews(prev => prev.filter(r => r.id !== id));
            return true;
        } catch (err: any) {
            const msg = err?.response?.data?.message || 'Không thể xoá đánh giá!';
            message.error(msg);
            return false;
        } finally {
            setDeletingId(null);
        }
    }, []);

    return {
        reviews,
        loading,
        deletingId,
        keyword,
        ratingFilter,
        setKeyword,
        setRatingFilter,
        refetch: () => fetchReviews(keyword.trim(), ratingFilter),
        deleteReview,
    };
};

export default useAdminReview;
