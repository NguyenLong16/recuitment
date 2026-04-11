using AutoMapper;
using Recruitment.API.Data;
using Recruitment.API.DTOs;
using Recruitment.API.Models;
using Recruitment.API.Repositories.Interfaces;
using Recruitment.API.Services.Interfaces;

namespace Recruitment.API.Services
{
    public class SkillService : ISkillService
    {
        private readonly ISkillRepository _skillRepository;
        private readonly IMapper _mapper;

        public SkillService(ISkillRepository skillRepository ,IMapper mapper)
        {
            _mapper = mapper;
            _skillRepository = skillRepository;
        }

        public async Task<SkillResponse> CreateSkillAsync(SkillRequest request)
        {
            var skill = _mapper.Map<Skill>(request);
            var createdSkill = await _skillRepository.CreateAsync(skill);
            return _mapper.Map<SkillResponse>(createdSkill);
        }

        public async Task DeleteSkillAsync(int id)
        {
            var result = await _skillRepository.DeleteAsync(id);
            if (!result)
            {
                throw new Exception("Không tìm thấy kỹ năng để xóa");
            }
        }

        public async Task<IEnumerable<SkillResponse>> GetAllSkillsAsync()
        {
            var skills = await _skillRepository.GetAllSkillsAsync();
            return _mapper.Map<IEnumerable<SkillResponse>>(skills);
        }

        public async Task<IEnumerable<SkillResponse>> GetAllSkillsForAdminAsync()
        {
            var skills = await _skillRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<SkillResponse>>(skills);
        }

        public async Task<SkillResponse> GetSkillByIdAsync(int id)
        {
            var skill = await _skillRepository.GetByIdAsync(id)
                ?? throw new Exception("Không tìm thấy kỹ năng");
            return _mapper.Map<SkillResponse>(skill);
        }

        public async Task<SkillResponse> UpdateSkillAsync(int id, SkillRequest request)
        {
            var existingSkill = await _skillRepository.GetByIdAsync(id)
                ?? throw new Exception("Không tìm thấy kỹ năng để cập nhật");

            existingSkill.skillName = request.Name;

            var updatedSkill = await _skillRepository.UpdateAsync(existingSkill);
            return _mapper.Map<SkillResponse>(updatedSkill);
        }
    }
}
