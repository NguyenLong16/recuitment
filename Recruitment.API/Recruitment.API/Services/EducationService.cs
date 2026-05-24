using AutoMapper;
using Recruitment.API.DTOs;
using Recruitment.API.Models;
using Recruitment.API.Repositories.Interfaces;
using Recruitment.API.Services.Interfaces;

namespace Recruitment.API.Services
{
    public class EducationService : IEducationService
    {
        private readonly IEducationRepository _educationRepository;
        private readonly IMapper _mapper;

        public EducationService(IEducationRepository educationRepository, IMapper mapper)
        {
            _educationRepository = educationRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<EducationDto>> GetByUserIdAsync(int userId)
        {
            var list = await _educationRepository.GetByUserIdAsync(userId);
            return _mapper.Map<IEnumerable<EducationDto>>(list);
        }

        public async Task<EducationDto> AddAsync(int userId, EducationRequest request)
        {
            var education = new Education
            {
                userId = userId,
                schoolName = request.SchoolName,
                major = request.Major,
                startDate = request.StartDate,
                endDate = request.EndDate ?? DateTime.MaxValue
            };
            await _educationRepository.AddAsync(education);
            return _mapper.Map<EducationDto>(education);
        }

        public async Task<EducationDto> UpdateAsync(int userId, int id, EducationRequest request)
        {
            var education = await _educationRepository.GetByIdAsync(id)
                ?? throw new Exception("Không tìm thấy học vấn");

            if (education.userId != userId)
                throw new Exception("Bạn không có quyền chỉnh sửa thông tin này");

            education.schoolName = request.SchoolName;
            education.major = request.Major;
            education.startDate = request.StartDate;
            education.endDate = request.EndDate ?? DateTime.MaxValue;

            await _educationRepository.UpdateAsync(education);
            return _mapper.Map<EducationDto>(education);
        }

        public async Task DeleteAsync(int userId, int id)
        {
            var education = await _educationRepository.GetByIdAsync(id)
                ?? throw new Exception("Không tìm thấy học vấn");

            if (education.userId != userId)
                throw new Exception("Bạn không có quyền xóa thông tin này");

            await _educationRepository.DeleteAsync(education);
        }
    }
}
