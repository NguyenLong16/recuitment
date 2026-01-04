using Recruitment.API.DTOs;

namespace Recruitment.API.Services.Interfaces
{
    public interface ISkillService
    {
        Task<IEnumerable<SkillResponse>> GetAllSkillsAsync();
    }
}
