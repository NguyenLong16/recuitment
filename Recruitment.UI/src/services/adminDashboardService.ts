import axiosClient from './axiosClient';
import { DashboardStats, DashboardTrends, DashboardDistributions, DashboardRankings } from '../types/adminDashboard';

export const adminDashboardService = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await axiosClient.get('/admin/AdminDashboard');
    return response.data;
  },
  getDashboardTrends: async (months: number = 12): Promise<DashboardTrends> => {
    const response = await axiosClient.get(`/admin/AdminDashboard/trends?months=${months}`);
    return response.data;
  },
  getDashboardDistributions: async (): Promise<DashboardDistributions> => {
    const response = await axiosClient.get('/admin/AdminDashboard/distributions');
    return response.data;
  },
  getDashboardRankings: async (topN: number = 5): Promise<DashboardRankings> => {
    const response = await axiosClient.get(`/admin/AdminDashboard/rankings?topN=${topN}`);
    return response.data;
  }
};
