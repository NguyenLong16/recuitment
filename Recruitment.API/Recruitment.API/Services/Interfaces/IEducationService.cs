using Recruitment.API.DTOs;

namespace Recruitment.API.Services.Interfaces
{
    public interface IEducationService
    {
        Task<IEnumerable<EducationDto>> GetByUserIdAsync(int userId);
        Task<EducationDto> AddAsync(int userId, EducationRequest request);
        Task<EducationDto> UpdateAsync(int userId, int id, EducationRequest request);
        Task DeleteAsync(int userId, int id);
    }
}
