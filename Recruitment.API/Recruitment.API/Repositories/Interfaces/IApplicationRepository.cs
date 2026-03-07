using Recruitment.API.Models;

namespace Recruitment.API.Repositories.Interfaces
{
    public interface IApplicationRepository
    {
        Task<IEnumerable<Application>> GetApplicationsByEmployerAsync(int employerId);
    }
}
