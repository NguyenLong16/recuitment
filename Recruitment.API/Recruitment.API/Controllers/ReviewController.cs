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
    public class ReviewController : ControllerBase
    {
        private readonly IReviewService _reviewService;

        public ReviewController(IReviewService reviewService)
        {
            _reviewService = reviewService;
        }

        // POST: api/reviews/job/{jobId}
        [Authorize]
        [HttpPost("job/{jobId}")]
        public async Task<IActionResult> PostReview(
            int jobId,
            [FromBody] ReviewCreateRequest request)
        {
            var userId = int.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var result = await _reviewService
                .PostReviewAsync(userId, jobId, request);

            return Ok(result);
        }

        [HttpGet("job/{jobId}")]
        [AllowAnonymous] // Cho phép xem đánh giá mà không cần đăng nhập
        public async Task<IActionResult> GetJobReviews(int jobId, [FromQuery] int? rating)
        {
            try
            {
                var result = await _reviewService.GetJobReviewsAsync(jobId, rating);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        //admin
        [HttpGet("admin")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetReviews([FromQuery] string? keyword, [FromQuery] int? rating)
        {
            try
            {
                var reviews = await _reviewService.GetReviewsAsync(keyword, rating);
                return Ok(reviews);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // DELETE: api/admin/reviews/{id}
        // Xóa các bình luận spam, chửi bới
        [HttpDelete("admin/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteReview(int id)
        {
            try
            {
                await _reviewService.DeleteReviewAsync(id);
                return Ok(new { message = "Đã xóa đánh giá vi phạm thành công!" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
