// src/hooks/useSkill.ts
import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import { Skill, CreateSkillRequest, UpdateSkillRequest } from '../types/skill';
import SkillService from '../services/skillService';

export interface UseSkillResult {
    skills: Skill[];
    loading: boolean;
    error: string | null;
    deletingId: number | null;
    submitting: boolean;
    refetch: () => Promise<void>;
    createSkill: (data: CreateSkillRequest) => Promise<boolean>;
    updateSkill: (id: number, data: UpdateSkillRequest) => Promise<boolean>;
    deleteSkill: (id: number) => Promise<boolean>;
}

/**
 * Custom hook quản lý CRUD kỹ năng (Skill) cho Admin
 */
const useSkill = (): UseSkillResult => {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // GET
    const fetchSkills = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await SkillService.getAllSkills();
            setSkills(response.data);
        } catch (err: any) {
            const errorMsg = 'Không thể tải danh sách kỹ năng!';
            setError(errorMsg);
            message.error(errorMsg);
        } finally {
            setLoading(false);
        }
    }, []);

    // POST
    const createSkill = useCallback(async (data: CreateSkillRequest): Promise<boolean> => {
        setSubmitting(true);
        try {
            await SkillService.createSkill(data);
            message.success('Thêm kỹ năng thành công!');
            await fetchSkills();
            return true;
        } catch (err: any) {
            message.error('Không thể thêm kỹ năng!');
            return false;
        } finally {
            setSubmitting(false);
        }
    }, [fetchSkills]);

    // PUT
    const updateSkill = useCallback(async (id: number, data: UpdateSkillRequest): Promise<boolean> => {
        setSubmitting(true);
        try {
            await SkillService.updateSkill(id, data);
            message.success('Cập nhật kỹ năng thành công!');
            await fetchSkills();
            return true;
        } catch (err: any) {
            message.error('Không thể cập nhật kỹ năng!');
            return false;
        } finally {
            setSubmitting(false);
        }
    }, [fetchSkills]);

    // DELETE
    const deleteSkill = useCallback(async (id: number): Promise<boolean> => {
        setDeletingId(id);
        try {
            await SkillService.deleteSkill(id);
            message.success('Xoá kỹ năng thành công!');
            await fetchSkills();
            return true;
        } catch (err: any) {
            console.error('Lỗi khi xoá kỹ năng:', err?.response?.data);
            message.error('Không thể xoá kỹ năng! Kỹ năng này đang được sử dụng bởi tin tuyển dụng.');
            return false;
        } finally {
            setDeletingId(null);
        }
    }, [fetchSkills]);

    useEffect(() => {
        fetchSkills();
    }, [fetchSkills]);

    return {
        skills,
        loading,
        error,
        deletingId,
        submitting,
        refetch: fetchSkills,
        createSkill,
        updateSkill,
        deleteSkill,
    };
};

export default useSkill;
