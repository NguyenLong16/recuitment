using Recruitment.API.Models;

namespace Recruitment.API.Repositories.Interfaces
{
    public interface IAdminCompanyRepository
    {
        /// <summary>[Admin] Lấy danh sách tất cả công ty, có thể lọc theo từ khóa tên công ty.</summary>
        Task<IEnumerable<Company>> GetAllCompaniesAsync(string? keyword = null);
    }
}
