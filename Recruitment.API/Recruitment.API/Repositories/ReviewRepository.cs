using Microsoft.EntityFrameworkCore;
using Recruitment.API.Data;
using Recruitment.API.Models;
using Recruitment.API.Repositories.Interfaces;

namespace Recruitment.API.Repositories
{
    public class ReviewRepository : IReviewRepository
    {
        private readonly AppDbContext _context;
        public ReviewRepository(AppDbContext context) => _context = context;

        public async Task<Review> AddAsync(Review review)
        {
            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();
            return review;
        }

        public async Task<IEnumerable<Review>> GetByJobIdAsync(int jobId)
        {
            return await _context.Reviews
                .Include(r => r.user)
                .Where(r => r.jobId == jobId)
                .ToListAsync();
        }

        public async Task<List<int>> GetRatingsByJobIdAsync(int jobId)
        {
            return await _context.Reviews
                .Where(r => r.jobId == jobId)
                .Select(r => r.rating)
                .ToListAsync();
        }

    }
}
