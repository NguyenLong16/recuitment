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


        public async Task<List<int>> GetRatingsByJobIdAsync(int jobId)
        {
            return await _context.Reviews
                .Where(r => r.jobId == jobId)
                .Select(r => r.rating)
                .ToListAsync();
        }

        public async Task<IEnumerable<Review>> GetByJobIdAsync(int jobId, int? starRating = null)
        {
            var query = _context.Reviews
                .Include(r => r.user) // Include User để lấy tên và avatar
                .Where(r => r.jobId == jobId);

            if (starRating.HasValue)
            {
                query = query.Where(r => r.rating == starRating.Value);
            }

            return await query
                .OrderByDescending(r => r.createdDate)
                .ToListAsync();
        }

        // Lấy tất cả review của job để Service tự tính toán thống kê
        public async Task<List<Review>> GetAllForJobAsync(int jobId)
        {
            return await _context.Reviews
                .Where(r => r.jobId == jobId)
                .ToListAsync();
        }

        //admin
        public async Task<IEnumerable<Review>> GetAllReviewsAsync(string? keyword = null, int? rating = null)
        {
            var query = _context.Reviews
                .Include(r => r.user)
                .Include(r => r.job).ThenInclude(j => j.company) // Lấy luôn thông tin công ty từ Job
                .AsQueryable();

            // Lọc theo số sao (Ví dụ: Admin muốn xem tất cả đánh giá 1 sao)
            if (rating.HasValue && rating.Value >= 1 && rating.Value <= 5)
            {
                query = query.Where(r => r.rating == rating.Value);
            }

            // Lọc theo từ khóa trong nội dung comment hoặc tên người đánh giá
            if (!string.IsNullOrWhiteSpace(keyword))
            {
                query = query.Where(r =>
                    (r.comment != null && r.comment.Contains(keyword)) ||
                    (r.user != null && r.user.fullName.Contains(keyword))
                );
            }

            // Sắp xếp đánh giá mới nhất lên đầu
            return await query.OrderByDescending(r => r.createdDate).ToListAsync();
        }

        public async Task<bool> DeleteReviewAsync(int reviewId)
        {
            var review = await _context.Reviews.FindAsync(reviewId);
            if (review == null) return false;

            _context.Reviews.Remove(review);
            await _context.SaveChangesAsync();
            return true;
        }

    }
}
