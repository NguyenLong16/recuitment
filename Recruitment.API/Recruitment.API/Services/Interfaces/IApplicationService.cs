using Recruitment.API.DTOs;
using static Recruitment.API.Data.Enums;

namespace Recruitment.API.Services.Interfaces
{
    public interface IApplicationService
    {
        Task<ApplicationResponse> ApplyJobAsync(ApplyJobRequest request, int candidateId);
        Task<ApplicationResponse> GetApplicationByIdAsync(int applicationId);
        Task<IEnumerable<ApplicationResponse>> GetApplicationsByCandidateAsync(int candidateId);
        // HR: Xem danh sách ứng viên theo JobId (kèm kiểm tra quyền sở hữu)
        Task<IEnumerable<ApplicationResponse>> GetApplicationJobIdAsync(int jobId, int employerId);
        Task<ApplicationResponse> UpdateApplicationStatusAsync(int applicationId, ApplicationStatus newStatus, int employerId);
        Task<IEnumerable<ApplicationResponse>> GetAllApplicationsForEmployerAsync(int employerId);
    }
}
