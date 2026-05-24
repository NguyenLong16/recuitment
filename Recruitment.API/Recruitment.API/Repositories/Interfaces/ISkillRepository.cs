using Recruitment.API.Models;

namespace Recruitment.API.Repositories.Interfaces
{
    public interface ISkillRepository
    {
        /// <summary>Lấy danh sách kỹ năng (dành cho user/employer khi tạo tin).</summary>
        Task<IEnumerable<Skill>> GetAllSkillsAsync();

        // ── Admin ──
        /// <summary>[Admin] Lấy toàn bộ kỹ năng.</summary>
        Task<IEnumerable<Skill>> GetAllAsync();

        /// <summary>[Admin] Lấy chi tiết kỹ năng theo ID.</summary>
        Task<Skill?> GetByIdAsync(int id);

        /// <summary>[Admin] Tạo mới kỹ năng.</summary>
        Task<Skill> CreateAsync(Skill skill);

        /// <summary>[Admin] Cập nhật kỹ năng.</summary>
        Task<Skill> UpdateAsync(Skill skill);

        /// <summary>[Admin] Xóa kỹ năng theo ID.</summary>
        Task<bool> DeleteAsync(int id);
    }
}
