using Recruitment.API.Models;

namespace Recruitment.API.Repositories.Interfaces
{
    public interface IExperienceRepository
    {
        Task<IEnumerable<Experience>> GetByUserIdAsync(int userId);
        Task<Experience?> GetByIdAsync(int id);
        Task AddAsync(Experience experience);
        Task UpdateAsync(Experience experience);
        Task DeleteAsync(Experience experience);
    }
}
