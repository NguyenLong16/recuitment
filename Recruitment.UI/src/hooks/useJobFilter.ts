import { useState, useEffect, useCallback } from "react";
import { JobFilterRequest, JobResponse } from "../types/job";
import JobService from "../services/jobService";

export const useJobFilter = () => {
    const [filters, setFilters] = useState<JobFilterRequest>({});
    const [jobs, setJobs] = useState<JobResponse[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchJobs = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await JobService.getJobWithFilter(filters);
            setJobs(response);
        } catch (err: any) {
            setError(err.message || 'Có lỗi xảy ra khi tải danh sách công việc');
        } finally {
            setIsLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchJobs();
    }, [fetchJobs]);

    const updateFilters = (newFilters: Partial<JobFilterRequest>) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    };

    const resetFilters = () => {
        setFilters({});
    };

    const refetch = () => {
        fetchJobs();
    };

    return {
        jobs,
        isLoading,
        error,
        filters,
        updateFilters,
        resetFilters,
        refetch,
    };
};
