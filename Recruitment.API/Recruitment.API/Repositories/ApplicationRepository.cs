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
                .Include(a => a.job.employerId == employerId)
                .OrderByDescending(a => a.appliedDate)
                .ToListAsync();
        }
    }
}
