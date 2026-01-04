using AutoMapper;
using Recruitment.API.Data;
using Recruitment.API.DTOs;
using Recruitment.API.Repositories.Interfaces;
using Recruitment.API.Services.Interfaces;

namespace Recruitment.API.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepository _catRepository;
        private readonly IMapper _mapper;
        private readonly AppDbContext _context;

        public CategoryService(ICategoryRepository catRepository, IMapper mapper, AppDbContext context)
        {
            _catRepository = catRepository;
            _mapper = mapper;
            _context = context;
        }

        public async Task<IEnumerable<CategoryResponse>> GetAllCategoriesAsync()
        {
            var cats = await _catRepository.GetAllCategoriesAsync();
            return _mapper.Map<IEnumerable<CategoryResponse>>(cats);
        }

    }
}
