// src/hooks/useAdminComment.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { message } from 'antd';
import { AdminComment } from '../types/comment';
import commentService from '../services/commentService';

export interface UseAdminCommentResult {
    comments: AdminComment[];
    loading: boolean;
    deletingId: number | null;
    keyword: string;
    setKeyword: (kw: string) => void;
    refetch: () => Promise<void>;
    deleteComment: (id: number) => Promise<boolean>;
}

/**
 * Custom hook quản lý bình luận cho trang Admin
 * Hỗ trợ tìm kiếm theo keyword (debounce 400ms) và xoá bình luận
 */
const useAdminComment = (): UseAdminCommentResult => {
    const [comments, setComments] = useState<AdminComment[]>([]);
    const [loading, setLoading] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [keyword, setKeyword] = useState('');

    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    /** Fetch danh sách bình luận từ server */
    const fetchComments = useCallback(async (kw?: string) => {
        setLoading(true);
        try {
            const data = await commentService.getAdminComments(kw || undefined);
            setComments(data);
        } catch (err: any) {
            const msg = err?.response?.data?.message || 'Không thể tải danh sách bình luận!';
            message.error(msg);
        } finally {
            setLoading(false);
        }
    }, []);

    /** Debounce khi keyword thay đổi */
    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            fetchComments(keyword.trim());
        }, 400);

        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [keyword, fetchComments]);

    /** Xoá bình luận theo ID */
    const deleteComment = useCallback(async (id: number): Promise<boolean> => {
        setDeletingId(id);
        try {
            await commentService.deleteAdminComment(id);
            message.success('Xoá bình luận thành công!');
            setComments(prev => prev.filter(c => c.id !== id));
            return true;
        } catch (err: any) {
            const msg = err?.response?.data?.message || 'Không thể xoá bình luận!';
            message.error(msg);
            return false;
        } finally {
            setDeletingId(null);
        }
    }, []);

    return {
        comments,
        loading,
        deletingId,
        keyword,
        setKeyword,
        refetch: () => fetchComments(keyword.trim()),
        deleteComment,
    };
};

export default useAdminComment;
