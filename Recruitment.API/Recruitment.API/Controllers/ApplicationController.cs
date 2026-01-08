using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Recruitment.API.DTOs;
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

        [HttpGet("job/{jobId}")]
        [Authorize(Roles = "Employer, Admin")]
        public async Task<IActionResult> GetApplicationByJob(int jobId)
        {
            try
            {
                var employerId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value);
                var result = await _applicationService.GetApplicationJobIdAsync(jobId, employerId);
                return Ok(result);
            } catch (Exception ex)
            {
                return BadRequest(new {message = ex.Message});
            }
        }

        [HttpPatch("{id}/status")]
        [Authorize(Roles = "Employer, Admin")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateStatusRequest request)
        {
            try
            {
                var employerId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value);
                var result = await _applicationService.UpdateApplicationStatusAsync(id, request.Status, employerId);
                return Ok(result);
            } catch (Exception ex)
            {
                return BadRequest(new {message = ex.Message});
            }
        }

        [HttpGet("all-my-applications")]
        [Authorize(Roles = "Employer")] // Chỉ Employer hoặc Admin mới có quyền xem
        public async Task<IActionResult> GetAllMyApplications()
        {
            try
            {
                // Lấy ID của HR đang đăng nhập từ JWT Token
                var employerIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
                if (employerIdClaim == null) return Unauthorized();

                int employerId = int.Parse(employerIdClaim.Value);

                var result = await _applicationService.GetAllApplicationsForEmployerAsync(employerId);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
