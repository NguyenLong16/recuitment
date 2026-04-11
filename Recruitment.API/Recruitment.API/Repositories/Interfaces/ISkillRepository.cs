using Recruitment.API.Models;

namespace Recruitment.API.Repositories.Interfaces
{
    public interface ISkillRepository
    {
        Task<IEnumerable<Skill>> GetAllSkillsAsync();
        //admin
        Task<IEnumerable<Skill>> GetAllAsync();
        Task<Skill?> GetByIdAsync(int id);
        Task<Skill> CreateAsync(Skill skill);
        Task<Skill> UpdateAsync(Skill skill);
        Task<bool> DeleteAsync(int id);
    }
}
