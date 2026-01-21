namespace Recruitment.API.Repositories.Interfaces
{
    public interface ISavedJobRepository
    {
        Task<bool> ToggleSaveJobAsync(int userId, int jobId);
        Task<bool> IsSavedAsync(int userId, int jobId);

    }
}
