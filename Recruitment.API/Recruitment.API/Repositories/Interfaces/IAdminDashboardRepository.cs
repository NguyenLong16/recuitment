using Recruitment.API.DTOs;

namespace Recruitment.API.Repositories.Interfaces
{
    public interface IAdminDashboardRepository
    {
        /// <summary>[Admin] Lấy thống kê tổng quan (số user, job, đơn ứng tuyển...).</summary>
        Task<AdminDashboardResponse> GetDashboardStatsAsync();

        /// <summary>[Admin] Lấy dữ liệu xu hướng theo tháng (số job/đơn tuyển theo thời gian).</summary>
        Task<TrendDashboardResponse> GetTrendDataAsync(int months);

        /// <summary>[Admin] Lấy phân bố dữ liệu (theo loại job, danh mục, địa điểm...).</summary>
        Task<DistributionDashboardResponse> GetDistributionDataAsync();

        /// <summary>[Admin] Lấy bảng xếp hạng top N (employer/job nổi bật nhất).</summary>
        Task<RankingDashboardResponse> GetRankingDataAsync(int topN);
    }
}
