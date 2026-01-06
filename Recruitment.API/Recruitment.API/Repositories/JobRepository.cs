using Microsoft.EntityFrameworkCore;
using Recruitment.API.Data;
using Recruitment.API.Models;
using Recruitment.API.Repositories.Interfaces;

namespace Recruitment.API.Repositories
{
    public class JobRepository : IJobRepository
    {

        private readonly AppDbContext _context;

        public JobRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Job> GetByIdAsync(int id)
        {
            return await _context.Jobs
                .Include(j => j.company)
                .Include(j => j.employer)
                .Include(j => j.location)
                .Include(j => j.category)
                .Include(j => j.jobSkills)
                    .ThenInclude(js => js.skill)
                .FirstOrDefaultAsync(j => j.id == id);
        }

        public async Task<IEnumerable<Job>> GetAllAsync()
        {
            return await _context.Jobs
                .Include(j => j.company)
                .Include(j => j.employer)
                .Include(j => j.location)
                .Include(j => j.category)
                .Include(j => j.jobSkills)
                    .ThenInclude(js => js.skill)
                .OrderByDescending(j => j.createdDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<Job>> GetByEmployerIdAsync(int employerId)
        {
            return await _context.Jobs
                .Include(j => j.company)
                .Include(j => j.employer)
                .Include(j => j.location)
                .Include(j => j.category)
                .Include(j => j.jobSkills)
                    .ThenInclude(js => js.skill)
                .Where(j => j.employerId == employerId)
                .OrderByDescending(j => j.createdDate)
                .ToListAsync();
        }

        public async Task<Job> CreateAsync(Job job)
        {
            _context.Jobs.Add(job);
            await _context.SaveChangesAsync();
            return job;
        }

        public async Task<Job> UpdateAsync(Job job)
        {
            _context.Jobs.Update(job);
            await _context.SaveChangesAsync();
            return job;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var job = await _context.Jobs.FindAsync(id);
            if (job == null) return false;

            _context.Jobs.Remove(job);
            await _context.SaveChangesAsync();
            return true;
        }

        // SINGLE: Add one skill (internal use)
        public async Task AddSkillToJobAsync(int jobId, List<int> skillIds)
        {
            if (skillIds == null || !skillIds.Any())
                return;

            var jobSkills = skillIds.Select(skillId => new JobSkill
            {
                jobId = jobId,
                skillId = skillId
            }).ToList();

            _context.JobSkills.AddRange(jobSkills);
        }

        public async Task RemoveSkillsFromJobAsync(int jobId)
        {
            var skills = _context.JobSkills.Where(js => js.jobId == jobId);
            _context.JobSkills.RemoveRange(skills);
        }

        // BATCH: Add multiple skills (remove old + add new) - FIX: Signature List<int> để match Service call
        // Recruitment.API.Repositories/JobRepository.cs

        public async Task AddSkillsToJobAsync(int jobId, List<int> skillIds)
        {
            // 1. Xóa toàn bộ skill cũ của Job này
            await RemoveSkillsFromJobAsync(jobId);

            // 2. Nếu danh sách mới rỗng thì dừng lại
            if (skillIds == null || !skillIds.Any()) return;

            // 3. THAY ĐỔI QUAN TRỌNG: Gọi hàm AddSkillToJobAsync MỘT LẦN DUY NHẤT cho cả danh sách
            // KHÔNG dùng vòng lặp foreach ở đây nữa.
            await AddSkillToJobAsync(jobId, skillIds);
        }
    }
}
