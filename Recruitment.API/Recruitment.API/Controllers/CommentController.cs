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
    }
}
