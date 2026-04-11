using Recruitment.API.DTOs;

namespace Recruitment.API.Services.Interfaces
{
    public interface IAdminDashboardService
    {
        Task<AdminDashboardResponse> GetDashboardStatsAsync();
        Task<TrendDashboardResponse> GetTrendDataAsync(int months);
        Task<DistributionDashboardResponse> GetDistributionDataAsync();
        Task<RankingDashboardResponse> GetRankingDataAsync(int topN);
    }
}
