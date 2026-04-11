using Recruitment.API.DTOs;

namespace Recruitment.API.Services.Interfaces
{
    public interface ILocationService
    {
        Task<IEnumerable<LocationResponse>> GetAllLocationAsync();
        //Admin
        Task<IEnumerable<LocationResponse>> GetAllLocationsForAdminAsync();
        Task<LocationResponse> GetLocationByIdAsync(int id);
        Task<LocationResponse> CreateLocationAsync(LocationRequest request);
        Task<LocationResponse> UpdateLocationAsync(int id, LocationRequest request);
        Task DeleteLocationAsync(int id);
    }
}
