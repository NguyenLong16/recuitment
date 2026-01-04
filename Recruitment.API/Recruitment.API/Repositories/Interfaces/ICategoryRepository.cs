using Recruitment.API.DTOs;
using Recruitment.API.Models;

namespace Recruitment.API.Repositories.Interfaces
{
    public interface ICategoryRepository
    {
        Task<IEnumerable<Category>> GetAllCategoriesAsync();
    }
}
