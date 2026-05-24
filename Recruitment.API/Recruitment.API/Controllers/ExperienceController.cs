using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Recruitment.API.DTOs;
using Recruitment.API.Services.Interfaces;
using System.Security.Claims;

namespace Recruitment.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ExperienceController : ControllerBase
    {
        private readonly IExperienceService _experienceService;

        public ExperienceController(IExperienceService experienceService)
        {
            _experienceService = experienceService;
        }

        /// <summary>Lấy danh sách kinh nghiệm của user hiện tại</summary>
        [HttpGet]
        public async Task<IActionResult> GetMyExperiences()
        {
            try
            {
                var userId = GetCurrentUserId();
                var result = await _experienceService.GetByUserIdAsync(userId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>Thêm kinh nghiệm làm việc mới</summary>
        [HttpPost]
        public async Task<IActionResult> Add([FromBody] ExperienceRequest request)
        {
            try
            {
                var userId = GetCurrentUserId();
                var result = await _experienceService.AddAsync(userId, request);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>Cập nhật kinh nghiệm làm việc theo ID</summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] ExperienceRequest request)
        {
            try
            {
                var userId = GetCurrentUserId();
                var result = await _experienceService.UpdateAsync(userId, id, request);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>Xóa kinh nghiệm làm việc theo ID</summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var userId = GetCurrentUserId();
                await _experienceService.DeleteAsync(userId, id);
                return Ok(new { message = "Xóa kinh nghiệm thành công" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        private int GetCurrentUserId()
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                ?? throw new Exception("Không xác định được người dùng");
            return int.Parse(userIdStr);
        }
    }
}
