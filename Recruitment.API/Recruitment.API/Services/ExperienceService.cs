using AutoMapper;
using Recruitment.API.DTOs;
using Recruitment.API.Models;
using Recruitment.API.Repositories.Interfaces;
using Recruitment.API.Services.Interfaces;

namespace Recruitment.API.Services
{
    public class ExperienceService : IExperienceService
    {
        private readonly IExperienceRepository _experienceRepository;
        private readonly IMapper _mapper;

        public ExperienceService(IExperienceRepository experienceRepository, IMapper mapper)
        {
            _experienceRepository = experienceRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<ExperienceDTO>> GetByUserIdAsync(int userId)
        {
            var list = await _experienceRepository.GetByUserIdAsync(userId);
            return _mapper.Map<IEnumerable<ExperienceDTO>>(list);
        }

        public async Task<ExperienceDTO> AddAsync(int userId, ExperienceRequest request)
        {
            var experience = new Experience
            {
                userId = userId,
                companyName = request.CompanyName,
                position = request.Position,
                description = request.Description,
                startDate = request.StartDate,
                endDate = request.EndDate
            };
            await _experienceRepository.AddAsync(experience);
            return _mapper.Map<ExperienceDTO>(experience);
        }

        public async Task<ExperienceDTO> UpdateAsync(int userId, int id, ExperienceRequest request)
        {
            var experience = await _experienceRepository.GetByIdAsync(id)
                ?? throw new Exception("Không tìm thấy kinh nghiệm");

            if (experience.userId != userId)
                throw new Exception("Bạn không có quyền chỉnh sửa thông tin này");

            experience.companyName = request.CompanyName;
            experience.position = request.Position;
            experience.description = request.Description;
            experience.startDate = request.StartDate;
            experience.endDate = request.EndDate;

            await _experienceRepository.UpdateAsync(experience);
            return _mapper.Map<ExperienceDTO>(experience);
        }

        public async Task DeleteAsync(int userId, int id)
        {
            var experience = await _experienceRepository.GetByIdAsync(id)
                ?? throw new Exception("Không tìm thấy kinh nghiệm");

            if (experience.userId != userId)
                throw new Exception("Bạn không có quyền xóa thông tin này");

            await _experienceRepository.DeleteAsync(experience);
        }
    }
}
