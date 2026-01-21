using Recruitment.API.DTOs;

namespace Recruitment.API.Services.Interfaces
{
    public interface ICommentService
    {
        Task<CommentResponse> PostCommentAsync(int userId, int jobId, CommentCreateRequest request);
        Task<IEnumerable<CommentResponse>> GetJobCommentsAsync(int jobId);
    }
}
