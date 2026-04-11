using Recruitment.API.DTOs;

namespace Recruitment.API.Services.Interfaces
{
    public interface IAdminUserService
    {
        Task<IEnumerable<AdminUserResponse>> GetUsersAsync(string? keyword, int? roleId);
        Task<bool> ToggleUserStatusAsync(int userId);
    }
}
