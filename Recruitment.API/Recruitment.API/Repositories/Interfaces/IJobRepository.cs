
using Recruitment.API.Data;
using Recruitment.API.DTOs;
using Recruitment.API.Models;

namespace Recruitment.API.Repositories.Interfaces
{
    public interface IJobRepository
    {
        /// <summary>Lấy chi tiết một tin tuyển dụng theo ID.</summary>
        Task<Job> GetByIdAsync(int id);

        /// <summary>Lấy danh sách tin tuyển dụng có lọc/tìm kiếm (dành cho ứng viên).</summary>
        Task<IEnumerable<Job>> GetAllAsync(JobFilterRequest filters);

        /// <summary>Lấy tất cả tin tuyển dụng của một nhà tuyển dụng (employer).</summary>
        Task<IEnumerable<Job>> GetByEmployerIdAsync(int employerId);

        /// <summary>Tạo mới tin tuyển dụng.</summary>
        Task<Job> CreateAsync(Job job);

        /// <summary>Cập nhật thông tin tin tuyển dụng.</summary>
        Task<Job> UpdateAsync(Job job);

        /// <summary>Xóa mềm / ẩn tin tuyển dụng theo ID.</summary>
        Task<bool> DeleteAsync(int id);

        /// <summary>Gắn danh sách kỹ năng vào tin tuyển dụng.</summary>
        Task AddSkillToJobAsync(int jobId, List<int> skillIds);

        /// <summary>Xóa toàn bộ kỹ năng khỏi tin tuyển dụng (dùng trước khi cập nhật lại).</summary>
        Task RemoveSkillsFromJobAsync(int jobId);

        // ── Admin ──
        /// <summary>[Admin] Lấy tất cả tin tuyển dụng, có thể lọc theo từ khóa và trạng thái.</summary>
        Task<IEnumerable<Job>> GetAllJobsAsync(string? keyword = null, Enums.JobStatus? status = null);

        /// <summary>[Admin] Ẩn/hiện tin tuyển dụng.</summary>
        Task<bool> ToggleHideJobAsync(int jobId);

        /// <summary>[Admin] Xóa vĩnh viễn tin tuyển dụng khỏi DB.</summary>
        Task<bool> DeleteJobAsync(int jobId);
    }
}
