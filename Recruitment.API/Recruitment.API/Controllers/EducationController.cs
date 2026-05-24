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
    public class EducationController : ControllerBase
    {
        private readonly IEducationService _educationService;

        public EducationController(IEducationService educationService)
        {
            _educationService = educationService;
        }

        /// <summary>Lấy danh sách học vấn của user hiện tại</summary>
        [HttpGet]
        public async Task<IActionResult> GetMyEducations()
        {
            try
            {
                var userId = GetCurrentUserId();
                var result = await _educationService.GetByUserIdAsync(userId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>Thêm học vấn mới</summary>
        [HttpPost]
        public async Task<IActionResult> Add([FromBody] EducationRequest request)
        {
            try
            {
                var userId = GetCurrentUserId();
                var result = await _educationService.AddAsync(userId, request);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>Cập nhật học vấn theo ID</summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] EducationRequest request)
        {
            try
            {
                var userId = GetCurrentUserId();
                var result = await _educationService.UpdateAsync(userId, id, request);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>Xóa học vấn theo ID</summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var userId = GetCurrentUserId();
                await _educationService.DeleteAsync(userId, id);
                return Ok(new { message = "Xóa học vấn thành công" });
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
