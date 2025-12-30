using Recruitment.API.DTOs;

namespace Recruitment.API.Services.Interfaces
{
    public interface IJobService
    {
        Task<JobResponse> CreateJobAsync(JobCreateRequest request, int employerId);
        Task<JobResponse> UpdateJobAsync(JobUpdateRequest request, int employerId);
        Task<bool> DeleteJobAsync(int id, int employerId);
        Task<JobResponse> GetJobByIdAsync(int id);
        Task<IEnumerable<JobResponse>> GetAllJobsAsync();
        Task<IEnumerable<JobResponse>> GetJobsByEmployerAsync(int employerId);
        Task<bool> ToggleJobStatusAsync(int id, int employerId);
    }
}
