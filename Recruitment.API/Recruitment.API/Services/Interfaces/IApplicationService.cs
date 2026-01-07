using Recruitment.API.DTOs;

namespace Recruitment.API.Services.Interfaces
{
    public interface IApplicationService
    {
        Task<ApplicationResponse> ApplyJobAsync(ApplyJobRequest request, int candidateId);
        Task<ApplicationResponse> GetApplicationByIdAsync(int applicationId);
        Task<IEnumerable<ApplicationResponse>> GetApplicationsByCandidateAsync(int candidateId);
    }
}
