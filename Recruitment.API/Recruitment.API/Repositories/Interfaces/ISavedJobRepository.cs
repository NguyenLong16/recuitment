namespace Recruitment.API.Repositories.Interfaces
{
    public interface ISavedJobRepository
    {
        /// <summary>Lưu hoặc bỏ lưu tin tuyển dụng (toggle). Trả về true nếu vừa lưu, false nếu vừa bỏ lưu.</summary>
        Task<bool> ToggleSaveJobAsync(int userId, int jobId);

        /// <summary>Kiểm tra user đã lưu tin tuyển dụng này chưa.</summary>
        Task<bool> IsSavedAsync(int userId, int jobId);

        /// <summary>Lấy danh sách tất cả tin tuyển dụng đã lưu của user.</summary>
        Task<IEnumerable<Recruitment.API.DTOs.SavedJobResponse>> GetSavedJobsAsync(int userId);
    }
}
