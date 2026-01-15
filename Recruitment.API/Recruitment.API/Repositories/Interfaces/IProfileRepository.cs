using Recruitment.API.DTOs;
using Recruitment.API.Models;

namespace Recruitment.API.Repositories.Interfaces
{
    public interface IProfileRepository
    {
        Task<User?> GetUserWithDetailsAsync(int userId);

        // Kiểm tra xem một ứng viên có đang theo dõi một HR hay không
        Task<bool> IsFollowingAsync(int followerId, int employerId);
        Task AddFollowAsync(Follow follow);
        Task RemoveFollowAsync(Follow follow);
        Task<Follow?> GetFollowRecordAsync(int followerId, int employerId);
        Task<IEnumerable<Follow>> GetFollowersByEmployerIdAsync(int employerId);
    }
}
