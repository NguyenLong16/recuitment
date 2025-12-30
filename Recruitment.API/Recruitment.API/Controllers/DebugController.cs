using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Recruitment.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DebugController : ControllerBase
    {
        [HttpGet("1-public")]
        public IActionResult PublicCheck()
        {
            return Ok(new { status = "Public API works" });
        }

        [HttpGet("2-authed")]
        [Authorize]
        public IActionResult AuthedCheck()
        {
            return Ok(new { status = "Token is valid (Authentication passed)" });
        }

        [HttpGet("3-view-claims")]
        [Authorize]
        public IActionResult ViewClaims()
        {
            var userClaims = User.Claims.Select(c => new { c.Type, c.Value }).ToList();
            var roleClaim = User.FindFirst(ClaimTypes.Role)?.Value
                         ?? User.FindFirst("role")?.Value
                         ?? "No Role Found";

            return Ok(new
            {
                message = "Server received these claims",
                currentRole = roleClaim,
                allClaims = userClaims
            });
        }

        [HttpGet("4-employer-role")]
        [Authorize(Roles = "Employer")]
        public IActionResult EmployerCheck()
        {
            return Ok(new { status = "You are authorized as Employer" });
        }
    }
}
