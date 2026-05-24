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

        public async Task<IEnumerable<Recruitment.API.DTOs.SavedJobResponse>> GetSavedJobsAsync(int userId)
        {
            return await _context.SavedJobs
                .Where(sj => sj.userId == userId)
                .Include(sj => sj.job)
                .ThenInclude(j => j.company)
                .Select(sj => new Recruitment.API.DTOs.SavedJobResponse
                {
                    JobId = sj.jobId,
                    JobTitle = sj.job.title,
                    CompanyName = sj.job.company != null ? sj.job.company.companyName : "N/A",
                    ImageUrl = sj.job.company != null ? sj.job.company.logoUrl : null,
                    SavedDate = sj.savedDate
                })
                .ToListAsync();
        }

    }
}
