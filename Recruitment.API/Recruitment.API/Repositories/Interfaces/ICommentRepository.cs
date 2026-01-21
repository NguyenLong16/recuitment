using Recruitment.API.Models;

namespace Recruitment.API.Repositories.Interfaces
{
    public interface ICommentRepository
    {
        Task<Comment> AddAsync(Comment comment);
        Task<IEnumerable<Comment>> GetByJobIdAsync(int jobId);
        Task<int> CountByJobIdAsync(int jobId);

    }
}
