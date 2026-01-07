using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Recruitment.API.DTOs;
using Recruitment.API.Models;
using Recruitment.API.Services.Interfaces;
using System.Security.Claims;

namespace Recruitment.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ApplicationController : ControllerBase
    {
        private readonly IApplicationService _applicationService;
        public ApplicationController(IApplicationService applicationService)
        {
            _applicationService = applicationService;
        }

        [HttpPost("apply")]
        [Authorize(Roles = "Candidate")]
        public async Task<IActionResult> Apply([FromForm] ApplyJobRequest request)
        {
            try
            {
                var candidateId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
                var result = await _applicationService.ApplyJobAsync(request, candidateId);
                return Ok(result);
            } catch (Exception ex) 
            {
                return BadRequest(new {message = ex.Message});
            }
        }

        [HttpGet("my-history")]
        [Authorize(Roles = "Candidate")]
        public async Task<IActionResult> GetHistoryMyApplications()
        {
            try
            {
                var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
                if(userIdClaim == null)
                {
                    return Unauthorized();
                }

                int candidateId = int.Parse(userIdClaim.Value);
                var history = await _applicationService.GetApplicationsByCandidateAsync(candidateId);
                return Ok(history);
            } catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
