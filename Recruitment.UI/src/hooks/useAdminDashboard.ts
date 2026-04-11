import { useState, useEffect } from 'react';
import { adminDashboardService } from '../services/adminDashboardService';
import { DashboardStats, DashboardTrends, DashboardDistributions, DashboardRankings } from '../types/adminDashboard';

export const useAdminDashboard = () => {
  const [months, setMonths] = useState<number>(12);
  const [topN, setTopN] = useState<number>(5);

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [trends, setTrends] = useState<DashboardTrends | null>(null);
  const [distributions, setDistributions] = useState<DashboardDistributions | null>(null);
  const [rankings, setRankings] = useState<DashboardRankings | null>(null);
  
  const [loading, setLoading] = useState<boolean>(true);
  const [rankingsLoading, setRankingsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGeneralData = async () => {
      try {
        setLoading(true);
        const [statsData, trendsData, distributionsData] = await Promise.all([
          adminDashboardService.getDashboardStats(),
          adminDashboardService.getDashboardTrends(months),
          adminDashboardService.getDashboardDistributions()
        ]);
        setStats(statsData);
        setTrends(trendsData);
        setDistributions(distributionsData);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Có lỗi xảy ra khi tải dữ liệu tổng quan.');
      } finally {
        setLoading(false);
      }
    };

    fetchGeneralData();
  }, [months]);

  useEffect(() => {
    const fetchRankingsData = async () => {
      try {
        setRankingsLoading(true);
        const rankingsData = await adminDashboardService.getDashboardRankings(topN);
        setRankings(rankingsData);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Có lỗi xảy ra khi tải dữ liệu xếp hạng.');
      } finally {
        setRankingsLoading(false);
      }
    };

    fetchRankingsData();
  }, [topN]);

  return { 
    stats, trends, distributions, rankings, 
    loading, rankingsLoading, error,
    months, setMonths,
    topN, setTopN
  };
};
