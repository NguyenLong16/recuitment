using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Recruitment.API.Services.Interfaces;
using System.Security.Claims;

namespace Recruitment.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UserSkillController : ControllerBase
    {
        private readonly IUserSkillService _userSkillService;

        public UserSkillController(IUserSkillService userSkillService)
        {
            _userSkillService = userSkillService;
        }

        /// <summary>Lấy danh sách kỹ năng của ứng viên hiện tại</summary>
        [HttpGet]
        public async Task<IActionResult> GetMySkills()
        {
            try
            {
                var userId = GetCurrentUserId();
                var skills = await _userSkillService.GetUserSkillsAsync(userId);
                return Ok(skills);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>Thêm kỹ năng vào hồ sơ ứng viên</summary>
        [HttpPost("{skillId}")]
        public async Task<IActionResult> AddSkill(int skillId)
        {
            try
            {
                var userId = GetCurrentUserId();
                await _userSkillService.AddSkillAsync(userId, skillId);
                return Ok(new { message = "Thêm kỹ năng thành công" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>Xóa kỹ năng khỏi hồ sơ ứng viên</summary>
        [HttpDelete("{skillId}")]
        public async Task<IActionResult> RemoveSkill(int skillId)
        {
            try
            {
                var userId = GetCurrentUserId();
                await _userSkillService.RemoveSkillAsync(userId, skillId);
                return Ok(new { message = "Xóa kỹ năng thành công" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>Lấy danh sách công việc gợi ý dựa trên kỹ năng của ứng viên</summary>
        [HttpGet("suggestions")]
        public async Task<IActionResult> GetJobSuggestions()
        {
            try
            {
                var userId = GetCurrentUserId();
                var suggestions = await _userSkillService.GetJobSuggestionsAsync(userId);
                return Ok(suggestions);
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
