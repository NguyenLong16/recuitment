using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Recruitment.API.Data;
using Recruitment.API.DTOs;
using Recruitment.API.Models;
using Recruitment.API.Repositories.Interfaces;
using Recruitment.API.Services.Interfaces;
using System.ComponentModel.Design;
using static Recruitment.API.Data.Enums;

namespace Recruitment.API.Services
{
    public class JobService : IJobService
    {
        private readonly IJobRepository _jobRepository;
        private readonly IMapper _mapper;
        private readonly AppDbContext _context;

        public JobService(IJobRepository jobRepository, IMapper mapper, AppDbContext context)
        {
            _jobRepository = jobRepository;
            _mapper = mapper;
            _context = context;
        }

        public async Task<JobResponse> CreateJobAsync(JobCreateRequest request, int employerId)
        {
            if (request.Deadline <= DateTime.Now)
                throw new Exception("Deadline phải sau thời điểm hiện tại");

            var employer = await _context.Users
                .Include(u => u.company)
                .FirstOrDefaultAsync(u => u.id == employerId)
                ?? throw new Exception("Employer not found");

            Company company;

            if (employer.companyId.HasValue)
            {
                company = await _context.Companies.FindAsync(employer.companyId.Value)
                    ?? throw new Exception("Company not found");

                if (!string.IsNullOrEmpty(request.CompanyName))
                    company.companyName = request.CompanyName;
            }
            else
            {
                company = new Company
                {
                    companyName = request.CompanyName ?? "Chưa đặt tên"
                };
                _context.Companies.Add(company);
                await _context.SaveChangesAsync();

                employer.companyId = company.id;
            }

            var job = new Job
            {
                title = request.Title,
                description = request.Description,
                requirement = request.Requirement,
                benefit = request.Benefit,
                salaryMin = request.SalaryMin,
                salaryMax = request.SalaryMax,
                locationId = request.LocationId,
                categoryId = request.CategoryId,
                jobType = request.JobType,
                deadline = request.Deadline,
                companyId = company.id,
                employerId = employerId,
                status = JobStatus.Active,
                createdDate = DateTime.Now,
                imageFile = request.ImageFile
            };

            await _jobRepository.CreateAsync(job);

            if (request.SkillIds?.Any() == true)
            {
                foreach (var skillId in request.SkillIds)
                {
                    if (!await _context.Skills.AnyAsync(s => s.id == skillId))
                        throw new Exception($"Skill {skillId} not found");

                    await _jobRepository.AddSkillToJobAsync(job.id, skillId);
                }
            }

            return await GetJobByIdAsync(job.id);
        }


        public async Task<JobResponse> UpdateJobAsync(int jobId, JobUpdateRequest request, int employerId)
        {
            var job = await _jobRepository.GetByIdAsync(jobId);

            if (job == null)
            {
                throw new Exception("Job not found");
            }

            if (job.employerId != employerId)
            {
                throw new Exception("You are not authorized to update this job");
            }

            // Partial update (giữ nguyên, nhưng mở rộng validation cho Status với expired)
            if (!string.IsNullOrEmpty(request.Title)) job.title = request.Title;
            if (!string.IsNullOrEmpty(request.Description)) job.description = request.Description;
            if (!string.IsNullOrEmpty(request.Requirement)) job.requirement = request.Requirement;
            if (!string.IsNullOrEmpty(request.Benefit)) job.benefit = request.Benefit;
            if (request.SalaryMin.HasValue) job.salaryMin = request.SalaryMin.Value;
            if (request.SalaryMax.HasValue) job.salaryMax = request.SalaryMax.Value;

            // Validate & Update Location/Category nếu có thay đổi (giữ nguyên)
            if (request.LocationId.HasValue)
            {
                var location = await _context.Locations.FindAsync(request.LocationId.Value);
                if (location == null) throw new Exception("Location not found");
                job.locationId = request.LocationId.Value;
            }

            if (request.CategoryId.HasValue)
            {
                var category = await _context.Categories.FindAsync(request.CategoryId.Value);
                if (category == null) throw new Exception("Category not found");
                job.categoryId = request.CategoryId.Value;
            }

            if (!string.IsNullOrEmpty(request.CompanyName) && job.company != null)
            {
                job.company.companyName = request.CompanyName;
            }

            // JobType nullable OK (giữ nguyên)
            if (request.JobType.HasValue) job.jobType = request.JobType.Value;

            // Validate Deadline nếu có thay đổi (giữ nguyên)
            if (request.Deadline.HasValue)
            {
                if (request.Deadline <= DateTime.Now)  // SỬA: <= để tránh = Now
                    throw new Exception("Deadline phải sau thời điểm hiện tại");
                job.deadline = request.Deadline.Value;
            }

            // THÊM MỚI: Validate Status với expired check (mở rộng từ code cũ)
            if (request.Status.HasValue)
            {
                var newStatus = request.Status.Value;
                if (newStatus == JobStatus.Active)
                {
                    // Bắt buộc deadline >= Now (dùng deadline hiện tại nếu không update)
                    var currentDeadline = request.Deadline ?? job.deadline;
                    if (currentDeadline < DateTime.Now)
                    {
                        throw new Exception("Để hiện job (Active), deadline phải sau thời điểm hiện tại. Vui lòng cập nhật deadline.");
                    }
                    // Nếu job Expired và deadline OK, tự động cho phép Active
                    if (job.status == JobStatus.Expired && currentDeadline >= DateTime.Now)
                    {
                        job.status = JobStatus.Active;  // Tự động hiện lại
                    }
                    else
                    {
                        job.status = newStatus;
                    }
                }
                else
                {
                    job.status = newStatus;  // Cho phép set Closed/Draft/Expired
                }
            }

            // THÊM MỚI: Auto-set Expired nếu Active và deadline qua (trước khi update)
            if (job.status == JobStatus.Active && job.deadline < DateTime.Now)
            {
                job.status = JobStatus.Expired;
            }

            await _jobRepository.UpdateAsync(job);

            // Update skills (giữ nguyên, nhưng chỉ nếu gửi skillIds mới)
            if (request.SkillIds != null && request.SkillIds.Any())
            {
                await _jobRepository.RemoveSkillsFromJobAsync(job.id);
                foreach (var skillId in request.SkillIds)
                {
                    var skill = await _context.Skills.FindAsync(skillId);
                    if (skill == null) throw new Exception($"Skill ID {skillId} not found");
                    await _jobRepository.AddSkillToJobAsync(job.id, skillId);
                }
            }
            if (!string.IsNullOrEmpty(request.ImageFile))
                job.imageFile = request.ImageFile;

            return await GetJobByIdAsync(job.id);
        }

        public async Task<bool> DeleteJobAsync(int id, int employerId)
        {
            var job = await _jobRepository.GetByIdAsync(id);

            if (job == null)
            {
                throw new Exception("Job not found");
            }

            if (job.employerId != employerId)
            {
                throw new Exception("You are not authorized to delete this job");
            }

            // THÊM: Vẫn cho xóa nếu Expired (không cản)
            if (IsExpired(job))
            {
                // Optional: Log "Xóa job hết hạn"
            }

            return await _jobRepository.DeleteAsync(id);
        }

        public async Task<JobResponse> GetJobByIdAsync(int id)
        {
            var job = await _jobRepository.GetByIdAsync(id);

            if (job == null)
            {
                throw new Exception("Job not found");
            }

            // THÊM MỚI: Auto-set Expired nếu Active và deadline qua (cho single job)
            if (job.status == JobStatus.Active && job.deadline < DateTime.Now)
            {
                job.status = JobStatus.Expired;
                await _jobRepository.UpdateAsync(job);  // Lưu ngay vào DB
            }

            return _mapper.Map<JobResponse>(job);
        }

        public async Task<IEnumerable<JobResponse>> GetAllJobsAsync()
        {
            var jobs = await _jobRepository.GetAllAsync();

            // THÊM MỚI: Auto-expire cho public list (chỉ trả Active không expired)
            var activeJobsPastDeadline = jobs.Where(j => j.status == JobStatus.Active && j.deadline < DateTime.Now).ToList();
            foreach (var job in activeJobsPastDeadline)
            {
                job.status = JobStatus.Expired;
            }
            if (activeJobsPastDeadline.Any())
            {
                await _context.SaveChangesAsync();
            }

            // Filter trả về chỉ Active không expired (cho public)
            return _mapper.Map<IEnumerable<JobResponse>>(jobs.Where(j => j.status == JobStatus.Active && j.deadline >= DateTime.Now));
        }

        public async Task<IEnumerable<JobResponse>> GetJobsByEmployerAsync(int employerId)
        {
            var jobs = await _jobRepository.GetByEmployerIdAsync(employerId);

            // THÊM MỚI: TỰ ĐỘNG KIỂM TRA VÀ SET EXPIRED (cho HR list - họ thấy hết, bao gồm Expired)
            var activeJobsPastDeadline = jobs.Where(j => j.status == JobStatus.Active && j.deadline < DateTime.Now).ToList();
            foreach (var job in activeJobsPastDeadline)
            {
                job.status = JobStatus.Expired;
            }
            if (activeJobsPastDeadline.Any())
            {
                await _context.SaveChangesAsync();  // Lưu thay đổi vào DB
            }

            // Trả về tất cả (HR cần thấy Expired để sửa)
            return _mapper.Map<IEnumerable<JobResponse>>(jobs);
        }

        public async Task<bool> ToggleJobStatusAsync(int id, int employerId)
        {
            var job = await _jobRepository.GetByIdAsync(id);

            if (job == null) throw new Exception("Job not found");
            if (job.employerId != employerId) throw new Exception("Unauthorized");

            // THÊM MỚI: VALIDATE - KHÔNG CHO TOGGLE NẾU EXPIRED
            if (IsExpired(job))
            {
                throw new Exception("Job đã hết hạn. Vui lòng cập nhật deadline để hiện lại.");
            }

            // THÊM MỚI: Trước set Active, kiểm tra deadline
            if (job.status != JobStatus.Active)
            {
                if (job.deadline < DateTime.Now)
                {
                    throw new Exception("Deadline đã qua. Vui lòng cập nhật deadline để hiện job.");
                }
            }

            // Logic đảo trạng thái (giữ nguyên: Active <-> Closed)
            if (job.status == JobStatus.Active)
            {
                job.status = JobStatus.Closed;
            }
            else  // Closed/Draft → Active (với check deadline ở trên)
            {
                job.status = JobStatus.Active;
            }

            await _jobRepository.UpdateAsync(job);
            return true;
        }

        // THÊM MỚI: Helper method để kiểm tra expired
        private bool IsExpired(Job job)
        {
            return job.status == JobStatus.Expired ||
                   (job.status == JobStatus.Active && job.deadline < DateTime.Now);
        }
    }
}
