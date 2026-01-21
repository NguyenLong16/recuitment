using Microsoft.EntityFrameworkCore;
using Recruitment.API.Data;
using Recruitment.API.Models;
using Recruitment.API.Repositories.Interfaces;

namespace Recruitment.API.Repositories
{
    public class SavedJobRepository : ISavedJobRepository
    {
        private readonly AppDbContext _context;
        public SavedJobRepository(AppDbContext context)
        {
            _context = context;
        }
        public async Task<bool> ToggleSaveJobAsync(int userId, int jobId)
        {
            var existing = await _context.SavedJobs
                .FirstOrDefaultAsync(sj => sj.userId == userId && sj.jobId == jobId);

            if(existing != null)
            {
                _context.SavedJobs.Remove(existing);
                await _context.SaveChangesAsync();
                return false;
            }

            _context.SavedJobs.Add(new SavedJob { userId = userId, jobId = jobId });
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> IsSavedAsync(int userId, int jobId)
        {
            return await _context.SavedJobs
                .AnyAsync(sj => sj.userId == userId && sj.jobId == jobId);
        }

    }
}
