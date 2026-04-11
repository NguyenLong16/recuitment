using Recruitment.API.DTOs;

namespace Recruitment.API.Services
{
    public interface IAdminCompanyService
    {
        Task<IEnumerable<AdminCompanyResponse>> GetCompaniesAsync(string? keyword);
    }
}
