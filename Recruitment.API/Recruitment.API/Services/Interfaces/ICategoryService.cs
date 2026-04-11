using Recruitment.API.DTOs;

namespace Recruitment.API.Services.Interfaces
{
    public interface ICategoryService
    {
        Task<IEnumerable<CategoryResponse>> GetAllCategoriesAsync();
        //Admin
        Task<IEnumerable<CategoryResponse>> GetAllAsyncForAdmin();
        Task<CategoryResponse> GetCategoryByIdAsync(int id);
        Task<CategoryResponse> CreateCategoryAsync(CategoryRequest request);
        Task<CategoryResponse> UpdateCategoryAsync(int id, CategoryRequest request);
        Task DeleteCategoryAsync(int id);
    }
}
