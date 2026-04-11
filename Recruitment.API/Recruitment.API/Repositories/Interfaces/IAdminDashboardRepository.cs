using Recruitment.API.DTOs;

namespace Recruitment.API.Repositories.Interfaces
{
    public interface IAdminDashboardRepository
    {
        Task<AdminDashboardResponse> GetDashboardStatsAsync();
        Task<TrendDashboardResponse> GetTrendDataAsync(int months);
        Task<DistributionDashboardResponse> GetDistributionDataAsync();
        Task<RankingDashboardResponse> GetRankingDataAsync(int topN);
    }
}
