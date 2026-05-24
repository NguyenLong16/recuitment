using Recruitment.API.Models;

namespace Recruitment.API.Repositories.Interfaces
{
    public interface IAdminUserRepository
    {
        /// <summary>[Admin] Lấy danh sách tất cả user, có thể lọc theo từ khóa và role.</summary>
        Task<IEnumerable<User>> GetAllUsersAsync(string? keyword = null, int? roleId = null);

        /// <summary>[Admin] Khóa/mở khóa tài khoản user (toggle isActive).</summary>
        Task<bool> ToggleUserStatusAsync(int userId);
    }
}
