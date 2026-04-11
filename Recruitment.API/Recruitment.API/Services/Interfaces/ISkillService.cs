using Recruitment.API.DTOs;

namespace Recruitment.API.Services.Interfaces
{
    public interface ISkillService
    {
        Task<IEnumerable<SkillResponse>> GetAllSkillsAsync();
        //admin
        Task<IEnumerable<SkillResponse>> GetAllSkillsForAdminAsync();
        Task<SkillResponse> GetSkillByIdAsync(int id);
        Task<SkillResponse> CreateSkillAsync(SkillRequest request);
        Task<SkillResponse> UpdateSkillAsync(int id, SkillRequest request);
        Task DeleteSkillAsync(int id);
    }
}
