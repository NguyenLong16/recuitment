using Recruitment.API.Models;

namespace Recruitment.API.Repositories.Interfaces
{
    public interface ISkillRepository
    {
        Task<IEnumerable<Skill>> GetAllSkillsAsync();
    }
}
