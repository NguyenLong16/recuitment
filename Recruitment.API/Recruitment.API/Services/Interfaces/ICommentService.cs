using Recruitment.API.DTOs;
using Recruitment.API.Models;

namespace Recruitment.API.Services.Interfaces
{
    public interface ICommentService
    {
        Task<CommentResponse> PostCommentAsync(int userId, int jobId, CommentCreateRequest request);
        Task<IEnumerable<CommentResponse>> GetJobCommentsAsync(int jobId);
    }
}
