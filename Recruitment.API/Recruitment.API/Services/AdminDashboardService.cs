using Recruitment.API.DTOs;
using Recruitment.API.Repositories.Interfaces;
using Recruitment.API.Services.Interfaces;

namespace Recruitment.API.Services
{
    public class AdminDashboardService : IAdminDashboardService
    {
        private readonly IAdminDashboardRepository _repository;

        public AdminDashboardService(IAdminDashboardRepository repository)
        {
            _repository = repository;
        }

        public async Task<AdminDashboardResponse> GetDashboardStatsAsync()
        {
            return await _repository.GetDashboardStatsAsync();
        }

        public async Task<TrendDashboardResponse> GetTrendDataAsync(int months)
        {
            return await _repository.GetTrendDataAsync(months);
        }

        public async Task<DistributionDashboardResponse> GetDistributionDataAsync()
        {
            return await _repository.GetDistributionDataAsync();
        }

        public async Task<RankingDashboardResponse> GetRankingDataAsync(int topN)
        {
            return await _repository.GetRankingDataAsync(topN);
        }
    }
}
