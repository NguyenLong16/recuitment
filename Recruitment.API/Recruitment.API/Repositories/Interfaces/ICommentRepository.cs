using Recruitment.API.Models;

namespace Recruitment.API.Repositories.Interfaces
{
    public interface ICommentRepository
    {
        Task<Comment> AddAsync(Comment comment);
        Task<IEnumerable<Comment>> GetByJobIdAsync(int jobId);
        Task<int> CountByJobIdAsync(int jobId);
        Task<Comment> GetByIdAsync(int id);
        //admin
        Task<IEnumerable<Comment>> GetAllCommentsAsync(string? keyword = null);
        Task<bool> DeleteCommentAsync(int commentId);

    }
}
