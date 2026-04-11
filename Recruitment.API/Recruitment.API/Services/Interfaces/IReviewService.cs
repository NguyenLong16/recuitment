using AutoMapper;
using Recruitment.API.DTOs;
using Recruitment.API.Models;
using Recruitment.API.Repositories.Interfaces;

namespace Recruitment.API.Services.Interfaces
{
    public interface IReviewService
    {
        Task<ReviewResponse> PostReviewAsync(int userId, int jobId, ReviewCreateRequest request);

        // Hàm mới: Lấy thống kê và danh sách
        Task<ReviewSummaryResponse> GetJobReviewsAsync(int jobId, int? starRating = null);
        //admin
        Task<IEnumerable<AdminReviewResponse>> GetReviewsAsync(string? keyword, int? rating);
        Task DeleteReviewAsync(int reviewId);
    }
}
