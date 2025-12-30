using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Recruitment.API.Data;
using Recruitment.API.DTOs;
using Recruitment.API.Models;
using Recruitment.API.Repositories.Interfaces;
using Recruitment.API.Services.Interfaces;

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
            // Validate category and location exist
            var category = await _context.Categories.FindAsync(request.CategoryId);
            var location = await _context.Locations.FindAsync(request.LocationId);

            if (category == null || location == null)
            {
                throw new Exception("Category or Location not found");
            }

            // Get employer with company info
            var employer = await _context.Users
                .Include(u => u.company)
                .FirstOrDefaultAsync(u => u.id == employerId);

            if (employer == null)
            {
                throw new Exception("Employer not found");
            }

            if (employer.companyId == null)
            {
                throw new Exception("Employer does not have a company");
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
                companyId = employer.companyId.Value,
                employerId = employerId,
                status = Data.Enums.JobStatus.Open,
                createdDate = DateTime.Now
            };

            await _jobRepository.CreateAsync(job);

            // Add skills
            if (request.SkillIds != null && request.SkillIds.Any())
            {
                foreach (var skillId in request.SkillIds)
                {
                    await _jobRepository.AddSkillToJobAsync(job.id, skillId);
                }
            }

            return await GetJobByIdAsync(job.id);
        }

        public async Task<JobResponse> UpdateJobAsync(JobUpdateRequest request, int employerId)
        {
            var job = await _jobRepository.GetByIdAsync(request.Id);

            if (job == null)
            {
                throw new Exception("Job not found");
            }

            if (job.employerId != employerId)
            {
                throw new Exception("You are not authorized to update this job");
            }

            job.title = request.Title;
            job.description = request.Description;
            job.requirement = request.Requirement;
            job.benefit = request.Benefit;
            job.salaryMin = request.SalaryMin;
            job.salaryMax = request.SalaryMax;
            job.locationId = request.LocationId;
            job.categoryId = request.CategoryId;
            job.jobType = request.JobType;
            job.deadline = request.Deadline;

            await _jobRepository.UpdateAsync(job);

            // Update skills
            if (request.SkillIds != null)
            {
                await _jobRepository.RemoveSkillsFromJobAsync(job.id);
                foreach (var skillId in request.SkillIds)
                {
                    await _jobRepository.AddSkillToJobAsync(job.id, skillId);
                }
            }

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

            return await _jobRepository.DeleteAsync(id);
        }

        public async Task<JobResponse> GetJobByIdAsync(int id)
        {
            var job = await _jobRepository.GetByIdAsync(id);

            if (job == null)
            {
                throw new Exception("Job not found");
            }

            return _mapper.Map<JobResponse>(job);
        }

        public async Task<IEnumerable<JobResponse>> GetAllJobsAsync()
        {
            var jobs = await _jobRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<JobResponse>>(jobs);
        }

        public async Task<IEnumerable<JobResponse>> GetJobsByEmployerAsync(int employerId)
        {
            var jobs = await _jobRepository.GetByEmployerIdAsync(employerId);
            return _mapper.Map<IEnumerable<JobResponse>>(jobs);
        }

        public async Task<bool> ToggleJobStatusAsync(int id, int employerId)
        {
            var job = await _jobRepository.GetByIdAsync(id);

            if (job == null) throw new Exception("Job not found");
            if (job.employerId != employerId) throw new Exception("Unauthorized");

            // Logic đảo trạng thái:
            // Nếu đang Active -> chuyển sang Inactive (Ẩn)
            // Nếu đang Inactive/Draft -> chuyển sang Active (Hiện)
            if (job.status == Data.Enums.JobStatus.Open)
            {
                job.status = Data.Enums.JobStatus.Closed;
            }
            else
            {
                job.status = Data.Enums.JobStatus.Open;
            }

            await _jobRepository.UpdateAsync(job);
            return true;
        }
    }
}
