using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Recruitment.API.Services;

namespace Recruitment.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminCompanyController : ControllerBase
    {
        private readonly IAdminCompanyService _adminCompanyService;

        public AdminCompanyController(IAdminCompanyService adminCompanyService)
        {
            _adminCompanyService = adminCompanyService;
        }

        [HttpGet]
        public async Task<IActionResult> GetCompanies([FromQuery] string? keyword)
        {
            try
            {
                var companies = await _adminCompanyService.GetCompaniesAsync(keyword);
                return Ok(companies);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
