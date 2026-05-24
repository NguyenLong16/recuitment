using Microsoft.EntityFrameworkCore;
using Recruitment.API.Data;
using Recruitment.API.Models;
using Recruitment.API.Repositories.Interfaces;

namespace Recruitment.API.Repositories
{
    public class ApplicationRepository : IApplicationRepository
    {
        private readonly AppDbContext _context;
        public ApplicationRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Application>> GetApplicationsByEmployerAsync(int employerId)
        {
            return await _context.Applications 
                .Include(a => a.job)
                .Where(a => a.job.employerId == employerId)
                .OrderByDescending(a => a.appliedDate)
                .ToListAsync();
        }

        public async Task<Application> GetApplicationByIdAsync(int applicationId)
        {
            return await _context.Applications
                .Include(a => a.job)
                .FirstOrDefaultAsync(a => a.id == applicationId);
        }

        public async Task UpdateApplicationAsync(Application application)
        {
            _context.Applications.Update(application);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<Application>> GetSavedApplicationsByEmployerAsync(int employerId)
        {
            return await _context.Applications
                .Include(a => a.job)
                .Where(a => a.job.employerId == employerId && a.isSaved)
                .OrderByDescending(a => a.appliedDate)
                .ToListAsync();
        }
    }
}
