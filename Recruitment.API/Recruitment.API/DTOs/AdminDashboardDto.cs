namespace Recruitment.API.DTOs
{
    // DTO tổng quan cho Admin Dashboard
    public class AdminDashboardResponse
    {
        public UserStatsDto UserStats { get; set; }
        public int TotalCompanies { get; set; }
        public JobStatsDto JobStats { get; set; }
        public int TotalApplications { get; set; }
    }

    // Thống kê người dùng theo Role
    public class UserStatsDto
    {
        public int TotalUsers { get; set; }
        public int TotalCandidates { get; set; }
        public int TotalEmployers { get; set; }
    }

    // Thống kê Job theo Status
    public class JobStatsDto
    {
        public int TotalJobs { get; set; }
        public int ActiveJobs { get; set; }
        public int ExpiredJobs { get; set; }
        public int ClosedJobs { get; set; }
        public int DraftJobs { get; set; }
    }

    // ===== DTOs cho Biểu đồ Xu hướng (Trends) =====

    /// <summary>
    /// Một điểm dữ liệu chung theo tháng (dùng cho Job và Application trends).
    /// </summary>
    public class MonthlyDataPoint
    {
        public int Year { get; set; }
        public int Month { get; set; }
        public string Label { get; set; } // Ví dụ: "01/2026"
        public int Count { get; set; }
    }

    /// <summary>
    /// Một điểm dữ liệu tăng trưởng User theo tháng, phân biệt HR và Candidate.
    /// </summary>
    public class UserGrowthDataPoint
    {
        public int Year { get; set; }
        public int Month { get; set; }
        public string Label { get; set; } // Ví dụ: "01/2026"
        public int CandidateCount { get; set; }
        public int HRCount { get; set; }
        public int TotalCount { get; set; }
    }

    /// <summary>
    /// Response tổng hợp cho các biểu đồ xu hướng.
    /// </summary>
    public class TrendDashboardResponse
    {
        public List<UserGrowthDataPoint> UserGrowthTrend { get; set; }
        public List<MonthlyDataPoint> JobPostingTrend { get; set; }
        public List<MonthlyDataPoint> ApplicationTrend { get; set; }
    }

    // ===== DTOs cho Biểu đồ Tỷ lệ / Phân bổ (Pie/Donut Chart) =====

    /// <summary>
    /// Một phần tử trong biểu đồ phân bổ (Pie/Donut).
    /// </summary>
    public class DistributionItem
    {
        public string Label { get; set; }   // Tên trạng thái / hình thức
        public int Count { get; set; }       // Số lượng
        public double Percentage { get; set; } // Phần trăm (%)
    }

    /// <summary>
    /// Response tổng hợp cho các biểu đồ phân bổ.
    /// </summary>
    public class DistributionDashboardResponse
    {
        /// <summary>
        /// Tỷ lệ trạng thái ứng tuyển (Submitted, Viewed, Interview, Rejected, Accepted).
        /// </summary>
        public List<DistributionItem> ApplicationStatusDistribution { get; set; }

        /// <summary>
        /// Tỷ lệ công việc theo hình thức (FullTime, PartTime, Internship, Contract, Remote...).
        /// </summary>
        public List<DistributionItem> JobTypeDistribution { get; set; }
    }

    // ===== DTOs cho Bảng Xếp hạng (Top Rankings) =====

    /// <summary>
    /// Một phần tử trong bảng xếp hạng.
    /// </summary>
    public class RankingItem
    {
        public int Rank { get; set; }
        public int Id { get; set; }
        public string Name { get; set; }
        public int JobCount { get; set; }
    }

    /// <summary>
    /// Phần tử xếp hạng cho Top Công ty (bao gồm thêm logo và số CV nhận được).
    /// </summary>
    public class TopCompanyItem
    {
        public int Rank { get; set; }
        public int Id { get; set; }
        public string CompanyName { get; set; }
        public string? LogoUrl { get; set; }
        public int JobCount { get; set; }
        public int ApplicationCount { get; set; }
    }

    /// <summary>
    /// Response tổng hợp cho các bảng xếp hạng.
    /// </summary>
    public class RankingDashboardResponse
    {
        /// <summary>
        /// Top ngành nghề (Category) có nhiều Job nhất.
        /// </summary>
        public List<RankingItem> TopCategories { get; set; }

        /// <summary>
        /// Top kỹ năng (Skill) được yêu cầu nhiều nhất.
        /// </summary>
        public List<RankingItem> TopSkills { get; set; }

        /// <summary>
        /// Top công ty tuyển dụng tích cực nhất.
        /// </summary>
        public List<TopCompanyItem> TopCompanies { get; set; }

        /// <summary>
        /// Top địa điểm có nhiều Job nhất.
        /// </summary>
        public List<RankingItem> TopLocations { get; set; }
    }
}
