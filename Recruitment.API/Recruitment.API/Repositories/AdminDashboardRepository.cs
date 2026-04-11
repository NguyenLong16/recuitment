using Microsoft.EntityFrameworkCore;
using Recruitment.API.Data;
using Recruitment.API.DTOs;
using Recruitment.API.Repositories.Interfaces;
using static Recruitment.API.Data.Enums;

namespace Recruitment.API.Repositories
{
    public class AdminDashboardRepository : IAdminDashboardRepository
    {
        private readonly AppDbContext _context;

        public AdminDashboardRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<AdminDashboardResponse> GetDashboardStatsAsync()
        {
            // Thống kê User theo Role
            // Role: "Candidate" cho ứng viên, "HR" cho nhà tuyển dụng
            var totalUsers = await _context.Users.CountAsync();
            var totalCandidates = await _context.Users
                .CountAsync(u => u.role.roleName == "Candidate");
            var totalEmployers = await _context.Users
                .CountAsync(u => u.role.roleName == "Employer");

            // Thống kê Company
            var totalCompanies = await _context.Companies.CountAsync();

            // Thống kê Job theo Status
            var totalJobs = await _context.Jobs.CountAsync();
            var activeJobs = await _context.Jobs
                .CountAsync(j => j.status == JobStatus.Active);
            var expiredJobs = await _context.Jobs
                .CountAsync(j => j.status == JobStatus.Expired);
            var closedJobs = await _context.Jobs
                .CountAsync(j => j.status == JobStatus.Closed);
            var draftJobs = await _context.Jobs
                .CountAsync(j => j.status == JobStatus.Draft);

            // Thống kê Application (Lượt ứng tuyển)
            var totalApplications = await _context.Applications.CountAsync();

            return new AdminDashboardResponse
            {
                UserStats = new UserStatsDto
                {
                    TotalUsers = totalUsers,
                    TotalCandidates = totalCandidates,
                    TotalEmployers = totalEmployers
                },
                TotalCompanies = totalCompanies,
                JobStats = new JobStatsDto
                {
                    TotalJobs = totalJobs,
                    ActiveJobs = activeJobs,
                    ExpiredJobs = expiredJobs,
                    ClosedJobs = closedJobs,
                    DraftJobs = draftJobs
                },
                TotalApplications = totalApplications
            };
        }

        /// <summary>
        /// Lấy dữ liệu xu hướng theo tháng cho biểu đồ.
        /// </summary>
        /// <param name="months">Số tháng gần nhất cần lấy dữ liệu (mặc định 12).</param>
        public async Task<TrendDashboardResponse> GetTrendDataAsync(int months)
        {
            // Tính mốc thời gian bắt đầu
            var now = DateTime.Now;
            var startDate = new DateTime(now.Year, now.Month, 1).AddMonths(-(months - 1));

            // ===== 1. Tăng trưởng User mới (phân biệt HR và Candidate) =====
            var userGrowthRaw = await _context.Users
                .Where(u => u.createdDate.HasValue && u.createdDate.Value >= startDate)
                .GroupBy(u => new
                {
                    Year = u.createdDate.Value.Year,
                    Month = u.createdDate.Value.Month,
                    Role = u.role.roleName
                })
                .Select(g => new
                {
                    g.Key.Year,
                    g.Key.Month,
                    g.Key.Role,
                    Count = g.Count()
                })
                .ToListAsync();

            // ===== 2. Lượng Job đăng mới mỗi tháng =====
            var jobTrendRaw = await _context.Jobs
                .Where(j => j.createdDate >= startDate)
                .GroupBy(j => new
                {
                    Year = j.createdDate.Year,
                    Month = j.createdDate.Month
                })
                .Select(g => new
                {
                    g.Key.Year,
                    g.Key.Month,
                    Count = g.Count()
                })
                .ToListAsync();

            // ===== 3. Lượng CV/Application nộp vào mỗi tháng =====
            var appTrendRaw = await _context.Applications
                .Where(a => a.appliedDate >= startDate)
                .GroupBy(a => new
                {
                    Year = a.appliedDate.Year,
                    Month = a.appliedDate.Month
                })
                .Select(g => new
                {
                    g.Key.Year,
                    g.Key.Month,
                    Count = g.Count()
                })
                .ToListAsync();

            // ===== Tạo danh sách đầy đủ các tháng (bao gồm tháng không có dữ liệu) =====
            var allMonths = Enumerable.Range(0, months)
                .Select(i => startDate.AddMonths(i))
                .Select(d => new { d.Year, d.Month, Label = $"{d.Month:D2}/{d.Year}" })
                .ToList();

            // Map dữ liệu User Growth
            var userGrowthTrend = allMonths.Select(m =>
            {
                var candidateCount = userGrowthRaw
                    .Where(x => x.Year == m.Year && x.Month == m.Month && x.Role == "Candidate")
                    .Sum(x => x.Count);
                var hrCount = userGrowthRaw
                    .Where(x => x.Year == m.Year && x.Month == m.Month && x.Role == "Employer")
                    .Sum(x => x.Count);

                return new UserGrowthDataPoint
                {
                    Year = m.Year,
                    Month = m.Month,
                    Label = m.Label,
                    CandidateCount = candidateCount,
                    HRCount = hrCount,
                    TotalCount = candidateCount + hrCount
                };
            }).ToList();

            // Map dữ liệu Job Posting
            var jobPostingTrend = allMonths.Select(m =>
            {
                var count = jobTrendRaw
                    .Where(x => x.Year == m.Year && x.Month == m.Month)
                    .Sum(x => x.Count);

                return new MonthlyDataPoint
                {
                    Year = m.Year,
                    Month = m.Month,
                    Label = m.Label,
                    Count = count
                };
            }).ToList();

            // Map dữ liệu Application
            var applicationTrend = allMonths.Select(m =>
            {
                var count = appTrendRaw
                    .Where(x => x.Year == m.Year && x.Month == m.Month)
                    .Sum(x => x.Count);

                return new MonthlyDataPoint
                {
                    Year = m.Year,
                    Month = m.Month,
                    Label = m.Label,
                    Count = count
                };
            }).ToList();

            return new TrendDashboardResponse
            {
                UserGrowthTrend = userGrowthTrend,
                JobPostingTrend = jobPostingTrend,
                ApplicationTrend = applicationTrend
            };
        }

        /// <summary>
        /// Lấy dữ liệu phân bổ (Pie/Donut Chart) cho Dashboard.
        /// </summary>
        public async Task<DistributionDashboardResponse> GetDistributionDataAsync()
        {
            // ===== 1. Tỷ lệ Trạng thái Ứng tuyển =====
            var totalApplications = await _context.Applications.CountAsync();

            var appStatusRaw = await _context.Applications
                .GroupBy(a => a.status)
                .Select(g => new
                {
                    Status = g.Key,
                    Count = g.Count()
                })
                .ToListAsync();

            // Đảm bảo tất cả trạng thái đều xuất hiện (kể cả count = 0)
            var applicationStatusDistribution = Enum.GetValues(typeof(ApplicationStatus))
                .Cast<ApplicationStatus>()
                .Select(status =>
                {
                    var match = appStatusRaw.FirstOrDefault(x => x.Status == status);
                    var count = match?.Count ?? 0;
                    return new DistributionItem
                    {
                        Label = status.ToString(),
                        Count = count,
                        Percentage = totalApplications > 0
                            ? Math.Round((double)count / totalApplications * 100, 2)
                            : 0
                    };
                })
                .ToList();

            // ===== 2. Tỷ lệ Công việc theo Hình thức (JobType) =====
            var totalJobs = await _context.Jobs.CountAsync();

            var jobTypeRaw = await _context.Jobs
                .GroupBy(j => j.jobType)
                .Select(g => new
                {
                    JobType = g.Key,
                    Count = g.Count()
                })
                .ToListAsync();

            // Đảm bảo tất cả hình thức đều xuất hiện
            var jobTypeDistribution = Enum.GetValues(typeof(JobType))
                .Cast<JobType>()
                .Select(type =>
                {
                    var match = jobTypeRaw.FirstOrDefault(x => x.JobType == type);
                    var count = match?.Count ?? 0;
                    return new DistributionItem
                    {
                        Label = type.ToString(),
                        Count = count,
                        Percentage = totalJobs > 0
                            ? Math.Round((double)count / totalJobs * 100, 2)
                            : 0
                    };
                })
                .ToList();

            return new DistributionDashboardResponse
            {
                ApplicationStatusDistribution = applicationStatusDistribution,
                JobTypeDistribution = jobTypeDistribution
            };
        }

        /// <summary>
        /// Lấy dữ liệu bảng xếp hạng (Top Rankings) cho Dashboard.
        /// </summary>
        /// <param name="topN">Số lượng bản ghi lấy ra mỗi danh sách.</param>
        public async Task<RankingDashboardResponse> GetRankingDataAsync(int topN)
        {
            // ===== 1. Top Ngành nghề (Category) =====
            var topCategoriesRaw = await _context.Categories
                .Select(c => new
                {
                    c.id,
                    c.name,
                    JobCount = c.jobs.Count()
                })
                .OrderByDescending(x => x.JobCount)
                .Take(topN)
                .ToListAsync();

            var topCategories = topCategoriesRaw.Select((x, index) => new RankingItem
            {
                Rank = index + 1,
                Id = x.id,
                Name = x.name,
                JobCount = x.JobCount
            }).ToList();

            // ===== 2. Top Kỹ năng (Skill) =====
            var topSkillsRaw = await _context.Skills
                .Select(s => new
                {
                    s.id,
                    s.skillName,
                    JobCount = s.jobSkills.Count()
                })
                .OrderByDescending(x => x.JobCount)
                .Take(topN)
                .ToListAsync();

            var topSkills = topSkillsRaw.Select((x, index) => new RankingItem
            {
                Rank = index + 1,
                Id = x.id,
                Name = x.skillName,
                JobCount = x.JobCount
            }).ToList();

            // ===== 3. Top Công ty =====
            var topCompaniesRaw = await _context.Companies
                .Select(c => new
                {
                    c.id,
                    c.companyName,
                    c.logoUrl,
                    JobCount = c.Jobs.Count(),
                    ApplicationCount = c.Jobs.SelectMany(j => j.applications).Count()
                })
                .OrderByDescending(x => x.JobCount)
                .Take(topN)
                .ToListAsync();

            var topCompanies = topCompaniesRaw.Select((x, index) => new TopCompanyItem
            {
                Rank = index + 1,
                Id = x.id,
                CompanyName = x.companyName,
                LogoUrl = x.logoUrl,
                JobCount = x.JobCount,
                ApplicationCount = x.ApplicationCount
            }).ToList();

            // ===== 4. Top Địa điểm (Location) =====
            var topLocationsRaw = await _context.Locations
                .Select(l => new
                {
                    l.id,
                    l.name,
                    JobCount = l.jobs.Count()
                })
                .OrderByDescending(x => x.JobCount)
                .Take(topN)
                .ToListAsync();

            var topLocations = topLocationsRaw.Select((x, index) => new RankingItem
            {
                Rank = index + 1,
                Id = x.id,
                Name = x.name,
                JobCount = x.JobCount
            }).ToList();

            return new RankingDashboardResponse
            {
                TopCategories = topCategories,
                TopSkills = topSkills,
                TopCompanies = topCompanies,
                TopLocations = topLocations
            };
        }
    }
}
