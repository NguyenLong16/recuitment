using CloudinaryDotNet.Actions;
using Microsoft.EntityFrameworkCore;
using Recruitment.API.Data;
using Recruitment.API.Models;
using Recruitment.API.Repositories.Interfaces;
using static Microsoft.Extensions.Logging.EventSource.LoggingEventSource;

namespace Recruitment.API.Repositories
{
    public class AdminUserRepository : IAdminUserRepository
    {
        private readonly AppDbContext _context;

        public AdminUserRepository(AppDbContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<User>> GetAllUsersAsync(string? keyword = null, int? roleId = null)
        {
            var query = _context.Users
                .Include(u => u.role)       // Nạp bảng Role để lấy RoleName
                .Include(u => u.company)    // Nạp bảng Company để lấy CompanyName
                .AsQueryable();

            // 1. Lọc chính xác theo RoleId (Dropdown)
            if (roleId.HasValue && roleId.Value > 0)
            {
                query = query.Where(u => u.roleId == roleId.Value);
            }

            // 2. Tìm kiếm theo Tên hoặc Email (Ô Text)
            if (!string.IsNullOrWhiteSpace(keyword))
            {
                query = query.Where(u =>
                    u.fullName.Contains(keyword) ||
                    u.email.Contains(keyword)
                );
            }

            return await query.OrderByDescending(u => u.createdDate).ToListAsync();
        }

        public async Task<bool> ToggleUserStatusAsync(int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return false;

            // Đảo ngược trạng thái: Đang true thành false (Khóa), đang false thành true (Mở khóa)
            user.isActive = !user.isActive;

            await _context.SaveChangesAsync();
            return true;
        }
    }
}
