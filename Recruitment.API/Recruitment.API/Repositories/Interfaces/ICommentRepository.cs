using Recruitment.API.Models;

namespace Recruitment.API.Repositories.Interfaces
{
    public interface ICommentRepository
    {
        /// <summary>Thêm bình luận mới vào tin tuyển dụng.</summary>
        Task<Comment> AddAsync(Comment comment);

        /// <summary>Lấy danh sách bình luận của một tin tuyển dụng.</summary>
        Task<IEnumerable<Comment>> GetByJobIdAsync(int jobId);

        /// <summary>Đếm số lượng bình luận của một tin tuyển dụng.</summary>
        Task<int> CountByJobIdAsync(int jobId);

        /// <summary>Lấy chi tiết bình luận theo ID.</summary>
        Task<Comment> GetByIdAsync(int id);

        // ── Admin ──
        /// <summary>[Admin] Lấy tất cả bình luận, có thể lọc theo từ khóa.</summary>
        Task<IEnumerable<Comment>> GetAllCommentsAsync(string? keyword = null);

        /// <summary>[Admin] Xóa bình luận theo ID.</summary>
        Task<bool> DeleteCommentAsync(int commentId);
    }
}
