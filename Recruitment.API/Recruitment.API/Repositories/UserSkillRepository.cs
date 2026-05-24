using Microsoft.EntityFrameworkCore;
using Recruitment.API.Data;
using Recruitment.API.Models;
using Recruitment.API.Repositories.Interfaces;
using static Recruitment.API.Data.Enums;

namespace Recruitment.API.Repositories
{
    public class UserSkillRepository : IUserSkillRepository
    {
        private readonly AppDbContext _context;

        public UserSkillRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<UserSkill>> GetUserSkillsAsync(int userId)
        {
            return await _context.UserSkills
                .Include(us => us.skill)
                .Where(us => us.userId == userId)
                .ToListAsync();
        }

        public async Task AddAsync(UserSkill userSkill)
        {
            await _context.UserSkills.AddAsync(userSkill);
            await _context.SaveChangesAsync();
        }

        public async Task RemoveAsync(UserSkill userSkill)
        {
            _context.UserSkills.Remove(userSkill);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> ExistsAsync(int userId, int skillId)
        {
            return await _context.UserSkills
                .AnyAsync(us => us.userId == userId && us.skillId == skillId);
        }

        public async Task<UserSkill?> GetByIdAsync(int userId, int skillId)
        {
            return await _context.UserSkills
                .FirstOrDefaultAsync(us => us.userId == userId && us.skillId == skillId);
        }

        public async Task<IEnumerable<(Job job, List<string> matchedSkills, int totalRequiredSkills)>> GetJobSuggestionsAsync(int userId)
        {
            // Lấy danh sách skillId của ứng viên
            var userSkillIds = await _context.UserSkills
                .Where(us => us.userId == userId)
                .Select(us => us.skillId)
                .ToListAsync();

            if (!userSkillIds.Any())
                return Enumerable.Empty<(Job, List<string>, int)>();

            // Lấy các Job đang mở, chưa hết hạn, có ít nhất 1 kỹ năng trùng
            var jobs = await _context.Jobs
                .Include(j => j.company)
                .Include(j => j.location)
                .Include(j => j.jobSkills)
                    .ThenInclude(js => js.skill)
                .Where(j => j.status == JobStatus.Active
                         && j.deadline > DateTime.Now
                         && j.jobSkills.Any(js => userSkillIds.Contains(js.skillId)))
                .ToListAsync();

            // Tính toán matched skills cho mỗi job
            var result = jobs
                .Select(job =>
                {
                    var jobSkillIds = job.jobSkills.Select(js => js.skillId).ToList();
                    var matched = job.jobSkills
                        .Where(js => userSkillIds.Contains(js.skillId))
                        .Select(js => js.skill.skillName)
                        .ToList();
                    return (job, matched, jobSkillIds.Count);
                })
                .OrderByDescending(x => x.matched.Count)
                .Take(20)
                .ToList();

            return result;
        }
    }
}
