using Recruitment.API.DTOs;

namespace Recruitment.API.Services.Interfaces
{
    public interface ILocationService
    {
        Task<IEnumerable<LocationResponse>> GetAllLocationAsync();
    }
}
