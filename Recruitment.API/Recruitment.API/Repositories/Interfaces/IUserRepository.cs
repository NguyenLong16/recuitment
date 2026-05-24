using Recruitment.API.Models;

namespace Recruitment.API.Repositories.Interfaces
{
    public interface IUserRepository
    {
        /// <summary>Lấy thông tin user theo ID.</summary>
        Task<User> GetByIdAsync(int id);

        /// <summary>Lấy thông tin user theo email (dùng khi đăng nhập).</summary>
        Task<User> GetByEmailAsync(string email);

        /// <summary>Kiểm tra email đã tồn tại trong hệ thống chưa (dùng khi đăng ký).</summary>
        Task<bool> ExistsByEmailAsync(string email);

        /// <summary>Tạo mới user vào DB.</summary>
        Task CreateAsync(User user);

        /// <summary>Cập nhật thông tin user.</summary>
        Task UpdateAsync(User user);
    }
}
