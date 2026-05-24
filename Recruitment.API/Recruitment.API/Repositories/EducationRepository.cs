using Microsoft.EntityFrameworkCore;
using Recruitment.API.Data;
using Recruitment.API.Models;
using Recruitment.API.Repositories.Interfaces;

namespace Recruitment.API.Repositories
{
    public class EducationRepository : IEducationRepository
    {
        private readonly AppDbContext _context;

        public EducationRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Education>> GetByUserIdAsync(int userId)
        {
            return await _context.Educations
                .Where(e => e.userId == userId)
                .OrderByDescending(e => e.startDate)
                .ToListAsync();
        }

        public async Task<Education?> GetByIdAsync(int id)
        {
            return await _context.Educations.FirstOrDefaultAsync(e => e.id == id);
        }

        public async Task AddAsync(Education education)
        {
            await _context.Educations.AddAsync(education);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Education education)
        {
            _context.Educations.Update(education);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Education education)
        {
            _context.Educations.Remove(education);
            await _context.SaveChangesAsync();
        }
    }
}
