using Recruitment.API.Models;

namespace Recruitment.API.Repositories.Interfaces
{
    public interface IApplicationRepository
    {
        /// <summary>Lấy danh sách hồ sơ ứng tuyển của tất cả tin đăng bởi employer.</summary>
        Task<IEnumerable<Application>> GetApplicationsByEmployerAsync(int employerId);

        /// <summary>Lấy chi tiết một hồ sơ ứng tuyển theo ID.</summary>
        Task<Application> GetApplicationByIdAsync(int applicationId);

        /// <summary>Cập nhật trạng thái hồ sơ ứng tuyển (Viewed, Interview, Rejected, Accepted...).</summary>
        Task UpdateApplicationAsync(Application application);

        /// <summary>Lấy danh sách hồ sơ đã được lưu/đánh dấu bởi employer.</summary>
        Task<IEnumerable<Application>> GetSavedApplicationsByEmployerAsync(int employerId);
    }
}
