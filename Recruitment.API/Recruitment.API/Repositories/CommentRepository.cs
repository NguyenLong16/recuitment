using Microsoft.EntityFrameworkCore;
using Recruitment.API.Data;
using Recruitment.API.Models;
using Recruitment.API.Repositories.Interfaces;

namespace Recruitment.API.Repositories
{
    public class CommentRepository : ICommentRepository
    {
        private readonly AppDbContext _context;
        public CommentRepository(AppDbContext context) => _context = context;

        public async Task<Comment> AddAsync(Comment comment)
        {
            _context.Comments.Add(comment);
            await _context.SaveChangesAsync();
            return comment;
        }

        public async Task<IEnumerable<Comment>> GetByJobIdAsync(int jobId)
        {
            return await _context.Comments
                .Include(c => c.user)
                .Include(c => c.Replies)
                .Where(c => c.jobId == jobId)
                .OrderByDescending(c => c.createdDate)
                .ToListAsync();
        }

        public async Task<int> CountByJobIdAsync(int jobId)
        {
            return await _context.Comments
                .CountAsync(c => c.jobId == jobId);
        }

        public async Task<Comment> GetByIdAsync(int id)
        {
            return await _context.Comments.FindAsync(id);
        }

        public async Task<IEnumerable<Comment>> GetAllCommentsAsync(string? keyword = null)
        {
            var query = _context.Comments
                .Include(c => c.user)
                .Include(c => c.job).ThenInclude(j => j.company)
                .AsQueryable();

            // Tìm kiếm theo từ khóa trong nội dung hoặc tên người bình luận
            if (!string.IsNullOrWhiteSpace(keyword))
            {
                query = query.Where(c =>
                    c.content.Contains(keyword) ||
                    (c.user != null && c.user.fullName.Contains(keyword))
                );
            }

            // Sắp xếp bình luận mới nhất lên đầu
            return await query.OrderByDescending(c => c.createdDate).ToListAsync();
        }

        public async Task<bool> DeleteCommentAsync(int commentId)
        {
            // Bao gồm luôn cả Replies để tránh lỗi khóa ngoại khi xóa bình luận gốc
            var comment = await _context.Comments
                .Include(c => c.Replies)
                .FirstOrDefaultAsync(c => c.id == commentId);

            if (comment == null) return false;

            // Xóa bình luận. (Lưu ý: Nếu comment gốc bị xóa, EF Core sẽ xóa luôn các reply con nếu bạn đã cấu hình Cascade Delete trong Database).
            _context.Comments.Remove(comment);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
