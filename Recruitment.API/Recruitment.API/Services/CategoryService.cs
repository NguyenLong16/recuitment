using AutoMapper;
using Recruitment.API.Data;
using Recruitment.API.DTOs;
using Recruitment.API.Models;
using Recruitment.API.Repositories.Interfaces;
using Recruitment.API.Services.Interfaces;

namespace Recruitment.API.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepository _catRepository;
        private readonly IMapper _mapper;
        private readonly AppDbContext _context;

        public CategoryService(ICategoryRepository catRepository, IMapper mapper)
        {
            _catRepository = catRepository;
            _mapper = mapper;
        }
        //Admin
        public async Task<CategoryResponse> CreateCategoryAsync(CategoryRequest request)
        {
            var category = _mapper.Map<Category>(request);
            var createdCategory = await _catRepository.CreateAsync(category);
            return _mapper.Map<CategoryResponse>(createdCategory);
        }

        public async Task DeleteCategoryAsync(int id)
        {
            var result = await _catRepository.DeleteAsync(id);
            if(!result)
            {
                throw new Exception("Không tìm thấy mục để xóa");
            }
        }

        public async Task<IEnumerable<CategoryResponse>> GetAllAsyncForAdmin()
        {
            var categories = await _catRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<CategoryResponse>>(categories);
        }

        public async Task<CategoryResponse> GetCategoryByIdAsync(int id)
        {
            var category = await _catRepository.GetByIdAsync(id)
                ?? throw new Exception("Không tìm thấy danh mục");
            return _mapper.Map<CategoryResponse>(category);
        }

        public async Task<CategoryResponse> UpdateCategoryAsync(int id, CategoryRequest request)
        {
            var existingCategory = await _catRepository.GetByIdAsync(id)
                ?? throw new Exception("Không tìm thấy danh mục để cập nhật");
            existingCategory.name = request.Name;
            var updateCategory = await _catRepository.UpdateAsync(existingCategory);
            return _mapper.Map<CategoryResponse>(updateCategory);
        }

        //User
        public async Task<IEnumerable<CategoryResponse>> GetAllCategoriesAsync()
        {
            var cats = await _catRepository.GetAllCategoriesAsync();
            return _mapper.Map<IEnumerable<CategoryResponse>>(cats);
        }
    }
}
