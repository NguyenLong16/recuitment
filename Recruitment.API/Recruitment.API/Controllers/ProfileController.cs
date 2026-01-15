using Microsoft.AspNetCore.Authorization;
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
    public class ProfileController : ControllerBase
    {
        private readonly IProfileService _profileService;
        public ProfileController(IProfileService profileService)
        {
            _profileService = profileService;
        }

        [HttpGet("me")]
        public async Task<IActionResult> GetMyProfile()
        {
            try
            {
                var userId = GetCurrentUserId();
                var profile = await _profileService.GetProfileAsync(userId);
                return Ok(profile);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // 2. Xem Profile của người khác (Ví dụ: Ứng viên xem Profile HR để nhấn Follow)
        [HttpGet("{id}")]
        [AllowAnonymous] // Cho phép xem công khai
        public async Task<IActionResult> GetUserProfile(int id)
        {
            try
            {
                // Lấy ID người đang xem (nếu có) để kiểm tra trạng thái IsFollowing
                var viewerIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                int? viewerId = !string.IsNullOrEmpty(viewerIdStr) ? int.Parse(viewerIdStr) : null;

                var profile = await _profileService.GetProfileAsync(id, viewerId);
                return Ok(profile);
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpPut("update")]
        public async Task<IActionResult> UpdateProfile([FromForm] ProfileUpdateRequest request)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
                var result = await _profileService.UpdateProfileUser(userId, request);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("follow/{employerId}")]
        [Authorize(Roles = "Candidate")] // Thường chỉ ứng viên mới follow HR
        public async Task<IActionResult> Follow(int employerId)
        {
            try
            {
                var followerId = GetCurrentUserId();
                await _profileService.FollowHRAsync(followerId, employerId);
                return Ok(new { message = "Đã theo dõi nhà tuyển dụng" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // 5. API Bỏ theo dõi (Unfollow)
        [HttpDelete("unfollow/{employerId}")]
        [Authorize(Roles = "Candidate")]
        public async Task<IActionResult> Unfollow(int employerId)
        {
            try
            {
                var followerId = GetCurrentUserId();
                await _profileService.UnfollowHRAsync(followerId, employerId);
                return Ok(new { message = "Đã bỏ theo dõi" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("{id}/followers")]
        [AllowAnonymous] // Cho phép xem công khai danh sách người theo dõi
        public async Task<IActionResult> GetFollowers(int id)
        {
            try
            {
                var followers = await _profileService.GetFollowersAsync(id);
                return Ok(followers);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        private int GetCurrentUserId()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.Parse(userId!);
        }
    }
}
