using Microsoft.EntityFrameworkCore;
using Recruitment.API.Data;
using Recruitment.API.DTOs;
using Recruitment.API.Models;
using Recruitment.API.Repositories.Interfaces;

namespace Recruitment.API.Repositories
{
    public class ProfileRepository : IProfileRepository
    {
        private readonly AppDbContext _context;
        public ProfileRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<User?> GetUserWithDetailsAsync(int userId)
        {
            // Tập hợp tất cả các Include cần thiết cho một Profile hoàn chỉnh
            return await _context.Users
                .Include(u => u.role)
                .Include(u => u.company)
                .Include(u => u.educations) // Thông tin học vấn
                .Include(u => u.experiences) // Kinh nghiệm làm việc
                .Include(u => u.postedJobs) // Các tin đã đăng (nếu là HR)
                .Include(u => u.followers) // Danh sách người theo dõi
                .FirstOrDefaultAsync(u => u.id == userId);
        }

        public async Task<bool> IsFollowingAsync(int followerId, int employerId)
        {
            return await _context.Follows
                .AnyAsync(f => f.id == followerId && f.employerId == employerId);
        }

        public async Task AddFollowAsync(Follow follow)
        {
            await _context.Follows.AddAsync(follow);
            await _context.SaveChangesAsync();
        }

        public async Task RemoveFollowAsync(Follow follow)
        {
            _context.Follows.Remove(follow);
            await _context.SaveChangesAsync();
        }

        public async Task<Follow?> GetFollowRecordAsync(int followerId, int employerId)
        {
            return await _context.Follows
                .FirstOrDefaultAsync(f => f.id == followerId && f.employerId == employerId);
        }

        public async Task<IEnumerable<Follow>> GetFollowersByEmployerIdAsync(int employerId)
        {
            return await _context.Follows
                .Include(f => f.follower) // Nạp thông tin User (người theo dõi)
                .Where(f => f.employerId == employerId)
                .OrderByDescending(f => f.createdDate)
                .ToListAsync();
        }
    }
}
