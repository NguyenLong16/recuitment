using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Recruitment.API.Services.Interfaces;

namespace Recruitment.API.Controllers
{
    [Route("api/admin/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminDashboardController : ControllerBase
    {
        private readonly IAdminDashboardService _dashboardService;

        public AdminDashboardController(IAdminDashboardService dashboardService)
        {
            _dashboardService = dashboardService;
        }

        /// <summary>
        /// Lấy thống kê tổng quan cho Admin Dashboard.
        /// Bao gồm: Tổng User (Candidate/Employer), Tổng Company, Tổng Job (theo status), Tổng Application.
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetDashboardStats()
        {
            try
            {
                var stats = await _dashboardService.GetDashboardStatsAsync();
                return Ok(stats);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Lấy dữ liệu biểu đồ xu hướng (Trends) cho Admin Dashboard.
        /// Bao gồm: Tăng trưởng User mới (HR/Candidate), Lượng Job đăng mới, Lượng Application nộp vào.
        /// </summary>
        /// <param name="months">Số tháng gần nhất cần hiển thị (mặc định: 12, tối đa: 24)</param>
        [HttpGet("trends")]
        public async Task<IActionResult> GetTrendData([FromQuery] int months = 12)
        {
            try
            {
                // Giới hạn khoảng hợp lệ
                if (months < 1) months = 1;
                if (months > 24) months = 24;

                var trends = await _dashboardService.GetTrendDataAsync(months);
                return Ok(trends);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Lấy dữ liệu biểu đồ phân bổ (Pie/Donut) cho Admin Dashboard.
        /// Bao gồm: Tỷ lệ trạng thái ứng tuyển, Tỷ lệ công việc theo hình thức.
        /// </summary>
        [HttpGet("distributions")]
        public async Task<IActionResult> GetDistributionData()
        {
            try
            {
                var distributions = await _dashboardService.GetDistributionDataAsync();
                return Ok(distributions);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Lấy bảng xếp hạng (Top Rankings) cho Admin Dashboard.
        /// Bao gồm: Top Ngành nghề, Top Kỹ năng, Top Công ty, Top Địa điểm.
        /// </summary>
        /// <param name="topN">Số lượng bản ghi lấy ra cho mỗi danh sách (mặc định: 5)</param>
        [HttpGet("rankings")]
        public async Task<IActionResult> GetRankingData([FromQuery] int topN = 5)
        {
            try
            {
                // Giới hạn giá trị hợp lý
                if (topN < 1) topN = 1;
                if (topN > 20) topN = 20;

                var rankings = await _dashboardService.GetRankingDataAsync(topN);
                return Ok(rankings);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
