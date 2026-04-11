using Recruitment.API.Models;

namespace Recruitment.API.Repositories.Interfaces
{
    public interface IReviewRepository
    {
        Task<Review> AddAsync(Review review);
        Task<List<int>> GetRatingsByJobIdAsync(int jobId);
        Task<IEnumerable<Review>> GetByJobIdAsync(int jobId, int? starRating = null);
        Task<List<Review>> GetAllForJobAsync(int jobId); // Lấy raw để tính thống kê
        //admin
        Task<IEnumerable<Review>> GetAllReviewsAsync(string? keyword = null, int? rating = null);
        Task<bool> DeleteReviewAsync(int reviewId);
    }
}
