using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Recruitment.API.Services.Interfaces;
using System.Security.Claims;

namespace Recruitment.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class SavedJobController : ControllerBase
    {
        private readonly ISavedJobService _savedJobService;

        public SavedJobController(ISavedJobService savedJobService)
        {
            _savedJobService = savedJobService;
        }

        // POST: api/saved-jobs/{jobId}
        [HttpPost("{jobId}")]
        public async Task<IActionResult> ToggleSaveJob(int jobId)
        {
            var userId = int.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var isSaved = await _savedJobService
                .ToggleSaveJobAsync(userId, jobId);

            return Ok(new
            {
                saved = isSaved,
                message = isSaved ? "Saved job" : "Unsaved job"
            });
        }
    }
}
