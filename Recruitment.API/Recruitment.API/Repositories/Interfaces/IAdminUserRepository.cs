using Recruitment.API.Models;

namespace Recruitment.API.Repositories.Interfaces
{
    public interface IAdminUserRepository
    {
        Task<IEnumerable<User>> GetAllUsersAsync(string? keyword = null, int? roleId = null);
        Task<bool> ToggleUserStatusAsync(int userId);
    }
}
