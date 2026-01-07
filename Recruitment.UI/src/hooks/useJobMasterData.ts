// src/hooks/useJobMasterData.ts
import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import { Skill } from '../types/skill';
import JobService from '../services/jobService';
import { Category } from '../types/category';
import { Location } from '../types/Location';

export interface UseJobMasterDataResult {
    locations: Location[];
    categories: Category[];
    skills: Skill[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

/**
 * Custom hook để fetch master data (locations, categories, skills)
 * Sử dụng trong các component cần dropdown data như JobForm
 */
export const useJobMasterData = (): UseJobMasterDataResult => {
    const [locations, setLocations] = useState<Location[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [skills, setSkills] = useState<Skill[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchMasterData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            console.log('Fetching master data...');

            const locRes = await JobService.getLocation().catch(err => {
                console.error('Location API error:', err);
                return { data: [] };
            });
            const catRes = await JobService.getCategory().catch(err => {
                console.error('Category API error:', err);
                return { data: [] };
            });
            const skillRes = await JobService.getSkills().catch(err => {
                console.error('Skills API error:', err);
                return { data: [] };
            });

            const locs: Location[] = Array.isArray(locRes.data) ? locRes.data : [];
            const cats: Category[] = Array.isArray(catRes.data) ? catRes.data : [];
            const sks: Skill[] = Array.isArray(skillRes.data) ? skillRes.data : [];

            setLocations(locs);
            setCategories(cats);
            setSkills(sks);

            console.log('Master data loaded:', {
                locations: locs.length,
                categories: cats.length,
                skills: sks.length,
            });

            if (locs.length === 0 || cats.length === 0 || sks.length === 0) {
                message.warning('Dữ liệu danh mục rỗng, kiểm tra API!');
            }
        } catch (err) {
            console.error('Master data error:', err);
            const errorMsg = 'Không thể tải dữ liệu danh mục.';
            setError(errorMsg);
            message.error(errorMsg);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMasterData();
    }, [fetchMasterData]);

    return {
        locations,
        categories,
        skills,
        loading,
        error,
        refetch: fetchMasterData,
    };
};

export default useJobMasterData;
