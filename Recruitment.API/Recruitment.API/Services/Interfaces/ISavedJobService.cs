namespace Recruitment.API.Services.Interfaces
{
    public interface ISavedJobService
    {
        Task<bool> ToggleSaveJobAsync(int userId, int jobId);
    }
}
