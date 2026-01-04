using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Recruitment.API.DTOs;
using Recruitment.API.Services.Interfaces;
using System.Security.Claims;

namespace Recruitment.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class JobController : ControllerBase
    {
        private readonly IJobService _jobService;
        private readonly ILogger<JobController> _logger;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public JobController(IJobService jobService, ILogger<JobController> logger, IWebHostEnvironment webHostEnvironment)
        {
            _jobService = jobService;
            _logger = logger;
            _webHostEnvironment = webHostEnvironment;
        }

        /// <summary>
        /// HR đăng tin tuyển dụng mới
        /// </summary>
        [HttpPost]
        [Authorize(Roles = "Employer,Admin")]
        [ProducesResponseType(typeof(JobCreateRequest), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> CreateJob([FromBody] JobCreateRequest request)
        {
            try
            {
                var employerId = GetCurrentUserId();

                if (employerId <= 0)
                {
                    return Unauthorized(new { message = "Invalid user" });
                }

                var job = await _jobService.CreateJobAsync(request, employerId);

                _logger.LogInformation("Job {JobId} created by user {UserId}", job.Id, employerId);

                return CreatedAtAction(nameof(GetJobById), new { id = job.Id }, job);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating job");
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Cập nhật tin tuyển dụng
        /// </summary>
        [HttpPut("{id}")]  // Id từ route
        [Authorize(Roles = "Employer")]
        public async Task<IActionResult> UpdateJob(int id, [FromBody] JobUpdateRequest request)  // request không có Id
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);  // Trả chi tiết validation errors

            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null) return Unauthorized();

                int employerId = int.Parse(userIdClaim.Value);
                var jobResponse = await _jobService.UpdateJobAsync(id, request, employerId);  // Truyền id
                return Ok(jobResponse);
            }
            catch (Exception ex)
            {
                // THÊM: Trả message rõ ràng
                return BadRequest(new { Message = ex.Message });
            }
        }

        /// <summary>
        /// Xóa tin tuyển dụng
        /// </summary>
        [HttpDelete("{id}")]
        [Authorize(Roles = "Employer,Admin")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteJob(int id)
        {
            try
            {
                var employerId = GetCurrentUserId();
                var result = await _jobService.DeleteJobAsync(id, employerId);

                if (!result)
                {
                    return NotFound(new { message = "Job not found" });
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting job {JobId}", id);
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Lấy thông tin tin tuyển dụng theo ID
        /// </summary>
        [HttpGet("{id}")]
        [AllowAnonymous]
        [ProducesResponseType(typeof(JobResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetJobById(int id)
        {
            try
            {
                var job = await _jobService.GetJobByIdAsync(id);
                return Ok(job);
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Lấy danh sách tất cả tin tuyển dụng (cho ứng viên)
        /// </summary>
        [HttpGet]
        [AllowAnonymous]
        [ProducesResponseType(typeof(IEnumerable<JobResponse>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAllJobs()
        {
            var jobs = await _jobService.GetAllJobsAsync();
            return Ok(jobs);
        }

        /// <summary>
        /// Lấy danh sách tin tuyển dụng của HR hiện tại
        /// </summary>
        [HttpGet("my-jobs")]
        [Authorize(Roles = "Employer,Admin")]
        [ProducesResponseType(typeof(IEnumerable<JobResponse>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetMyJobs()
        {
            var employerId = GetCurrentUserId();
            var jobs = await _jobService.GetJobsByEmployerAsync(employerId);
            return Ok(jobs);
        }

        [HttpPatch("{id}/toggle-status")]
        [Authorize(Roles = "Employer,Admin")]
        public async Task<IActionResult> ToggleStatus(int id)
        {
            try
            {
                var employerId = GetCurrentUserId();
                await _jobService.ToggleJobStatusAsync(id, employerId);
                return NoContent(); // 204 Success
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("upload-image")]
        [Authorize(Roles = "Employer, Admin")]
        public async Task<IActionResult> UploadImage(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("Không có file");

            // Validate type & size
            var allowedTypes = new[] { "image/jpeg", "image/png", "image/gif" };
            if (!allowedTypes.Contains(file.ContentType))
                return BadRequest("Chỉ hỗ trợ JPG, PNG, GIF");

            if (file.Length > 5 * 1024 * 1024)  // 5MB
                return BadRequest("File quá lớn (max 5MB)");

            try
            {
                var env = _webHostEnvironment;  // Inject IWebHostEnvironment
                var uploadsDir = Path.Combine(env.WebRootPath, "uploads/jobs");
                if (!Directory.Exists(uploadsDir))
                    Directory.CreateDirectory(uploadsDir);

                // Tạo subfolder theo tháng/năm (tùy chọn)
                var now = DateTime.Now;
                var subDir = Path.Combine(uploadsDir, now.Year.ToString(), now.Month.ToString("D2"));
                if (!Directory.Exists(subDir))
                    Directory.CreateDirectory(subDir);

                // Rename file: GUID + extension
                var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
                var filePath = Path.Combine(subDir, fileName);
                var relativeUrl = $"/uploads/jobs/{now.Year}/{now.Month:D2}/{fileName}";  // URL trả về

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                return Ok(new { url = relativeUrl, message = "Upload thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi upload: {ex.Message}");
            }
        }

        /// <summary>
        /// Lấy user ID từ JWT token
        /// </summary>
        private int GetCurrentUserId()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (int.TryParse(userId, out int id))
            {
                return id;
            }
            return 0;
        }
    }
}
