
using Recruitment.API.Models;

namespace Recruitment.API.Repositories.Interfaces
{
    public interface IJobRepository
    {
       
        Task<Job> GetByIdAsync(int id);
        Task<IEnumerable<Job>> GetAllAsync();
        Task<IEnumerable<Job>> GetByEmployerIdAsync(int employerId);
        Task<Job> CreateAsync(Job job);
        Task<Job> UpdateAsync(Job job);
        Task<bool> DeleteAsync(int id);
        Task AddSkillToJobAsync(int jobId, int skillId);
        Task RemoveSkillsFromJobAsync(int jobId);
        
    }
}
