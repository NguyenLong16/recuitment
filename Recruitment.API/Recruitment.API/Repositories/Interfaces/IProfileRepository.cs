using Recruitment.API.DTOs;
using Recruitment.API.Models;

namespace Recruitment.API.Repositories.Interfaces
{
    public interface IProfileRepository
    {
        /// <summary>Lấy thông tin user kèm đầy đủ dữ liệu liên quan (kinh nghiệm, học vấn, kỹ năng...).</summary>
        Task<User?> GetUserWithDetailsAsync(int userId);

        /// <summary>Kiểm tra ứng viên (followerId) có đang theo dõi HR/employer (employerId) hay không.</summary>
        Task<bool> IsFollowingAsync(int followerId, int employerId);

        /// <summary>Thêm quan hệ follow mới vào DB.</summary>
        Task AddFollowAsync(Follow follow);

        /// <summary>Xóa quan hệ follow khỏi DB (unfollow).</summary>
        Task RemoveFollowAsync(Follow follow);

        /// <summary>Lấy bản ghi follow giữa ứng viên và employer (dùng để kiểm tra trước khi unfollow).</summary>
        Task<Follow?> GetFollowRecordAsync(int followerId, int employerId);

        /// <summary>Lấy danh sách tất cả người đang theo dõi một employer.</summary>
        Task<IEnumerable<Follow>> GetFollowersByEmployerIdAsync(int employerId);
    }
}
