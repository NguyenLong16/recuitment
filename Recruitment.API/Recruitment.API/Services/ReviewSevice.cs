using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Recruitment.API.Data;
using Recruitment.API.DTOs;
using Recruitment.API.Models;
using Recruitment.API.Repositories.Interfaces;
using Recruitment.API.Services.Interfaces;

namespace Recruitment.API.Services
{
    public class ReviewSevice : IReviewService
    {
        private readonly IReviewRepository _repo;
        private readonly IMapper _mapper;
        private readonly AppDbContext _context;
        private IUserRepository _userRepository;
        private IJobRepository _jobRepository;
        private INotificationRepository _notificationRepository;

        public ReviewSevice(IReviewRepository repo, IMapper mapper, AppDbContext context, IUserRepository userRepository, IJobRepository jobRepository, INotificationRepository notificationRepository)
        {
            _repo = repo;
            _mapper = mapper;
            _context = context;
            _userRepository = userRepository;
            _jobRepository = jobRepository;
            _notificationRepository = notificationRepository;
        }

        public async Task<ReviewResponse> PostReviewAsync(int userId, int jobId, ReviewCreateRequest request)
        {
            var job = await _jobRepository.GetByIdAsync(jobId)
                ?? throw new Exception("Không tìm thấy bài tuyển dụng");

            var userReview = await _userRepository.GetByIdAsync(userId);

            var review = new Review { userId = userId, jobId = jobId, rating = request.Rating, comment = request.Comment, createdDate = DateTime.Now };
            await _repo.AddAsync(review);
            var reviewWithUser = await _context.Reviews
                .Include(r => r.user)
                .FirstAsync(r => r.id == review.id);

            if (job.employerId != userId)
            {
                await _notificationRepository.CreateNotificationAsync(
                    job.employerId,
                    "Có đánh giá mới", // Đổi từ "bình luận" sang "đánh giá" cho chuẩn xác
                    $"{userReview?.fullName} đã đánh giá bài: {job.title}",
                    "REVIEW", // THÊM MỚI: Loại thông báo
                    jobId);
            }
            return _mapper.Map<ReviewResponse>(review);
        }

        public async Task<ReviewSummaryResponse> GetJobReviewsAsync(int jobId, int? starRating = null)
        {
            // 1. Kiểm tra Job có tồn tại không
            var job = await _jobRepository.GetByIdAsync(jobId);
            if (job == null) throw new Exception("Không tìm thấy bài tuyển dụng");

            // 2. Lấy tất cả review để tính thống kê (Average, Count per star)
            // Lưu ý: Phần thống kê luôn tính trên TOÀN BỘ review, không bị ảnh hưởng bởi bộ lọc
            var allReviews = await _repo.GetAllForJobAsync(jobId);

            var totalReviews = allReviews.Count;
            double averageRating = 0;
            var starCounts = new Dictionary<int, int> { { 5, 0 }, { 4, 0 }, { 3, 0 }, { 2, 0 }, { 1, 0 } };

            if (totalReviews > 0)
            {
                averageRating = Math.Round(allReviews.Average(r => r.rating), 1); // Làm tròn 1 chữ số thập phân

                // Đếm số lượng từng sao
                var grouped = allReviews.GroupBy(r => r.rating)
                                        .Select(g => new { Rating = g.Key, Count = g.Count() });

                foreach (var g in grouped)
                {
                    if (starCounts.ContainsKey(g.Rating))
                    {
                        starCounts[g.Rating] = g.Count;
                    }
                }
            }

            // 3. Lấy danh sách review chi tiết (Có áp dụng bộ lọc starRating nếu user chọn)
            var filteredReviews = await _repo.GetByJobIdAsync(jobId, starRating);

            // 4. Đóng gói vào DTO
            return new ReviewSummaryResponse
            {
                AverageRating = averageRating,
                TotalReviews = totalReviews,
                StarCounts = starCounts,
                Reviews = _mapper.Map<IEnumerable<ReviewResponse>>(filteredReviews)
            };
        }
        //admin
        public async Task<IEnumerable<AdminReviewResponse>> GetReviewsAsync(string? keyword, int? rating)
        {
            var reviews = await _repo.GetAllReviewsAsync(keyword, rating);
            return _mapper.Map<IEnumerable<AdminReviewResponse>>(reviews);
        }

        public async Task DeleteReviewAsync(int reviewId)
        {
            var result = await _repo.DeleteReviewAsync(reviewId);
            if (!result) throw new Exception("Không tìm thấy đánh giá này hoặc đã bị xóa trước đó.");
        }
    }
}
