using Microsoft.EntityFrameworkCore;
using Recruitment.API.Data;
using Recruitment.API.Models;
using Recruitment.API.Repositories.Interfaces;

namespace Recruitment.API.Repositories
{
    public class ExperienceRepository : IExperienceRepository
    {
        private readonly AppDbContext _context;

        public ExperienceRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Experience>> GetByUserIdAsync(int userId)
        {
            return await _context.Experiences
                .Where(e => e.userId == userId)
                .OrderByDescending(e => e.startDate)
                .ToListAsync();
        }

        public async Task<Experience?> GetByIdAsync(int id)
        {
            return await _context.Experiences.FirstOrDefaultAsync(e => e.id == id);
        }

        public async Task AddAsync(Experience experience)
        {
            await _context.Experiences.AddAsync(experience);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Experience experience)
        {
            _context.Experiences.Update(experience);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Experience experience)
        {
            _context.Experiences.Remove(experience);
            await _context.SaveChangesAsync();
        }
    }
}
