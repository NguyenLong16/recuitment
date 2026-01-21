using Recruitment.API.Repositories.Interfaces;
using Recruitment.API.Services.Interfaces;

namespace Recruitment.API.Services
{
    public class SavedJobService : ISavedJobService
    {
        private readonly ISavedJobRepository _repository;
        public SavedJobService(ISavedJobRepository repository)
        {
            _repository = repository;
        }

        public async Task<bool> ToggleSaveJobAsync(int userId, int jobId)
        {
            return await _repository.ToggleSaveJobAsync(userId, jobId);
        }
    }
}
