using Recruitment.API.Models;

namespace Recruitment.API.Repositories.Interfaces
{
    public interface IUserSkillRepository
    {
        /// <summary>Lấy danh sách kỹ năng của một ứng viên</summary>
        Task<IEnumerable<UserSkill>> GetUserSkillsAsync(int userId);

        /// <summary>Thêm kỹ năng cho ứng viên</summary>
        Task AddAsync(UserSkill userSkill);

        /// <summary>Xóa kỹ năng của ứng viên</summary>
        Task RemoveAsync(UserSkill userSkill);

        /// <summary>Kiểm tra ứng viên đã có kỹ năng này chưa</summary>
        Task<bool> ExistsAsync(int userId, int skillId);

        /// <summary>Lấy bản ghi UserSkill cụ thể</summary>
        Task<UserSkill?> GetByIdAsync(int userId, int skillId);

        /// <summary>Lấy danh sách Job phù hợp với kỹ năng của ứng viên (sắp xếp theo số skill khớp)</summary>
        Task<IEnumerable<(Job job, List<string> matchedSkills, int totalRequiredSkills)>> GetJobSuggestionsAsync(int userId);
    }
}
