using Recruitment.API.Models;

namespace Recruitment.API.Repositories.Interfaces
{
    public interface IAdminCompanyRepository
    {
        Task<IEnumerable<Company>> GetAllCompaniesAsync(string? keyword = null);
    }
}
