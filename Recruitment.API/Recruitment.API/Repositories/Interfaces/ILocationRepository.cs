using Recruitment.API.Models;

namespace Recruitment.API.Repositories.Interfaces
{
    public interface ILocationRepository
    {
        Task<IEnumerable<Location>> GetAllLocationAsync();
    }
}
