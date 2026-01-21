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
                .Where(c => c.jobId == jobId)
                .OrderByDescending(c => c.createdDate)
                .ToListAsync();
        }

        public async Task<int> CountByJobIdAsync(int jobId)
        {
            return await _context.Comments
                .CountAsync(c => c.jobId == jobId);
        }

    }
}
