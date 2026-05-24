using Recruitment.API.DTOs;
using Recruitment.API.Models;
using Recruitment.API.Repositories.Interfaces;
using Recruitment.API.Services.Interfaces;

namespace Recruitment.API.Services
{
    public class UserSkillService : IUserSkillService
    {
        private readonly IUserSkillRepository _userSkillRepository;
        private readonly ISkillRepository _skillRepository;

        public UserSkillService(IUserSkillRepository userSkillRepository, ISkillRepository skillRepository)
        {
            _userSkillRepository = userSkillRepository;
            _skillRepository = skillRepository;
        }

        public async Task<IEnumerable<UserSkillResponse>> GetUserSkillsAsync(int userId)
        {
            var userSkills = await _userSkillRepository.GetUserSkillsAsync(userId);
            return userSkills.Select(us => new UserSkillResponse
            {
                skillId = us.skillId,
                skillName = us.skill.skillName
            });
        }

        public async Task AddSkillAsync(int userId, int skillId)
        {
            // Kiểm tra kỹ năng tồn tại trong hệ thống
            var skill = await _skillRepository.GetByIdAsync(skillId)
                ?? throw new Exception("Kỹ năng không tồn tại");

            // Kiểm tra user chưa có kỹ năng này
            if (await _userSkillRepository.ExistsAsync(userId, skillId))
                throw new Exception("Bạn đã có kỹ năng này trong hồ sơ");

            await _userSkillRepository.AddAsync(new UserSkill
            {
                userId = userId,
                skillId = skillId
            });
        }

        public async Task RemoveSkillAsync(int userId, int skillId)
        {
            var userSkill = await _userSkillRepository.GetByIdAsync(userId, skillId)
                ?? throw new Exception("Không tìm thấy kỹ năng trong hồ sơ của bạn");

            await _userSkillRepository.RemoveAsync(userSkill);
        }

        public async Task<IEnumerable<JobSuggestionResponse>> GetJobSuggestionsAsync(int userId)
        {
            var suggestions = await _userSkillRepository.GetJobSuggestionsAsync(userId);

            return suggestions.Select(item =>
            {
                var (job, matchedSkills, totalRequired) = item;
                int matchScore = totalRequired > 0
                    ? (int)Math.Round((double)matchedSkills.Count / totalRequired * 100)
                    : 0;

                return new JobSuggestionResponse
                {
                    id = job.id,
                    title = job.title,
                    companyName = job.company?.companyName ?? "",
                    companyLogoUrl = job.company?.logoUrl,
                    locationName = job.location?.name ?? "",
                    jobType = job.jobType.ToString(),
                    salaryMin = job.salaryMin,
                    salaryMax = job.salaryMax,
                    matchedSkills = matchedSkills,
                    matchScore = matchScore,
                    deadline = job.deadline,
                    imageUrl = job.imageUrl
                };
            });
        }
    }
}
