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
    public class CommentController : ControllerBase
    {
        private readonly ICommentService _commentService;

        public CommentController(ICommentService commentService)
        {
            _commentService = commentService;
        }

        // GET: api/comments/job/{jobId}
        [HttpGet("job/{jobId}")]
        public async Task<IActionResult> GetJobComments(int jobId)
        {
            var result = await _commentService.GetJobCommentsAsync(jobId);
            return Ok(result);
        }

        // POST: api/comments/job/{jobId}
        [Authorize]
        [HttpPost("job/{jobId}")]
        public async Task<IActionResult> PostComment(
            int jobId,
            [FromBody] CommentCreateRequest request)
        {
            var userId = int.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var result = await _commentService
                .PostCommentAsync(userId, jobId, request);

            return Ok(result);
        }
        //admin
        [HttpGet("admin")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetComments([FromQuery] string? keyword)
        {
            try
            {
                var comments = await _commentService.GetCommentsAsync(keyword);
                return Ok(comments);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // DELETE: api/admin/comments/{id}
        // Xóa bình luận độc hại
        [HttpDelete("admin/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteComment(int id)
        {
            try
            {
                await _commentService.DeleteCommentAsync(id);
                return Ok(new { message = "Đã xóa bình luận vi phạm thành công!" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
