using Microsoft.EntityFrameworkCore;
using Recruitment.API.Data;
using Recruitment.API.Models;
using Recruitment.API.Repositories.Interfaces;

namespace Recruitment.API.Repositories
{
    public class AdminCompanyRepository : IAdminCompanyRepository
    {
        private readonly AppDbContext _context;
        public AdminCompanyRepository(AppDbContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<Company>> GetAllCompaniesAsync(string? keyword = null)
        {
            var query = _context.Companies
                .Include(c => c.Jobs) // Nạp bảng Jobs để AutoMapper có thể đếm (Count)
                .AsQueryable();

            // Lọc theo từ khóa tìm kiếm (nếu có)
            if (!string.IsNullOrWhiteSpace(keyword))
            {
                query = query.Where(c => c.companyName.Contains(keyword));
            }

            // Sắp xếp công ty mới tạo lên đầu
            return await query.OrderByDescending(c => c.id).ToListAsync();
        }
    }
}
