using Recruitment.API.Models;

namespace Recruitment.API.Repositories.Interfaces
{
    public interface IReviewRepository
    {
        Task<Review> AddAsync(Review review);
        Task<IEnumerable<Review>> GetByJobIdAsync(int jobId);
        Task<List<int>> GetRatingsByJobIdAsync(int jobId);

    }
}
