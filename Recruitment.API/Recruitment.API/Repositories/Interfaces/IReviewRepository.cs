using Recruitment.API.Models;

namespace Recruitment.API.Repositories.Interfaces
{
    public interface IReviewRepository
    {
        /// <summary>Thêm đánh giá mới cho tin tuyển dụng.</summary>
        Task<Review> AddAsync(Review review);

        /// <summary>Lấy danh sách điểm đánh giá (rating) của một tin tuyển dụng.</summary>
        Task<List<int>> GetRatingsByJobIdAsync(int jobId);

        /// <summary>Lấy danh sách đánh giá của tin tuyển dụng, có thể lọc theo số sao.</summary>
        Task<IEnumerable<Review>> GetByJobIdAsync(int jobId, int? starRating = null);

        /// <summary>Lấy toàn bộ đánh giá raw của tin tuyển dụng (dùng để tính thống kê phân bố sao).</summary>
        Task<List<Review>> GetAllForJobAsync(int jobId);

        // ── Admin ──
        /// <summary>[Admin] Lấy tất cả đánh giá, có thể lọc theo từ khóa và số sao.</summary>
        Task<IEnumerable<Review>> GetAllReviewsAsync(string? keyword = null, int? rating = null);

        /// <summary>[Admin] Xóa đánh giá theo ID.</summary>
        Task<bool> DeleteReviewAsync(int reviewId);
    }
}
