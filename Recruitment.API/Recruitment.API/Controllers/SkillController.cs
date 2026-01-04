using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Recruitment.API.Services.Interfaces;

namespace Recruitment.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SkillController : ControllerBase
    {
        private ISkillService _skillService;
        public SkillController(ISkillService skillService)
        {
            _skillService = skillService;
        }

        [HttpGet]
        [Authorize(Roles = "User, Employer, Admin")]
        public async Task<IActionResult> GetAllSkillsAsync()
        {
            var skills = await _skillService.GetAllSkillsAsync();
            return Ok(skills);
        }
    }
}
