using Recruitment.API.DTOs;

namespace Recruitment.API.Services.Interfaces
{
    public interface IExperienceService
    {
        Task<IEnumerable<ExperienceDTO>> GetByUserIdAsync(int userId);
        Task<ExperienceDTO> AddAsync(int userId, ExperienceRequest request);
        Task<ExperienceDTO> UpdateAsync(int userId, int id, ExperienceRequest request);
        Task DeleteAsync(int userId, int id);
    }
}
