using Recruitment.API.DTOs;

namespace Recruitment.API.Services.Interfaces
{
    public interface IUserSkillService
    {
        /// <summary>Lấy danh sách kỹ năng của ứng viên hiện tại</summary>
        Task<IEnumerable<UserSkillResponse>> GetUserSkillsAsync(int userId);

        /// <summary>Thêm kỹ năng vào hồ sơ ứng viên</summary>
        Task AddSkillAsync(int userId, int skillId);

        /// <summary>Xóa kỹ năng khỏi hồ sơ ứng viên</summary>
        Task RemoveSkillAsync(int userId, int skillId);

        /// <summary>Lấy danh sách công việc gợi ý dựa trên kỹ năng của ứng viên</summary>
        Task<IEnumerable<JobSuggestionResponse>> GetJobSuggestionsAsync(int userId);
    }
}
