using Recruitment.API.Models;

namespace Recruitment.API.Repositories.Interfaces
{
    public interface IEducationRepository
    {
        Task<IEnumerable<Education>> GetByUserIdAsync(int userId);
        Task<Education?> GetByIdAsync(int id);
        Task AddAsync(Education education);
        Task UpdateAsync(Education education);
        Task DeleteAsync(Education education);
    }
}
