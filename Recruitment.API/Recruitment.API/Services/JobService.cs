using AutoMapper;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
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
            private readonly CloudinaryDotNet.Cloudinary _cloudinary;

            public JobService(IJobRepository jobRepository, IMapper mapper, AppDbContext context, CloudinaryDotNet.Cloudinary cloudinary)
            {
                _jobRepository = jobRepository;
                _mapper = mapper;
                _context = context;
                _cloudinary = cloudinary;
            }

            private async Task<string?> UploadImageToCloudinary(IFormFile? file)
            {
                if (file == null || file.Length == 0) return null;

                // Validate
                var allowedTypes = new[] { "image/jpeg", "image/png", "image/gif" };
                if (!allowedTypes.Contains(file.ContentType))
                    throw new ArgumentException("Chỉ hỗ trợ JPG, PNG, GIF");

                if (file.Length > 5 * 1024 * 1024)  // 5MB
                    throw new ArgumentException("File quá lớn (max 5MB)");

                try
                {
                    using var stream = file.OpenReadStream();
                    var uploadParams = new ImageUploadParams()
                    {
                        File = new FileDescription(file.FileName, stream),
                        UseFilename = true,
                        UniqueFilename = true,
                        Folder = "jobs",  // Thư mục trên Cloudinary
                                          // Optional: Resize (tối ưu)
                        Transformation = new Transformation().Width(800).Height(600).Crop("fill").Gravity("face"),
                    };

                    var uploadResult = await _cloudinary.UploadAsync(uploadParams);
                    if (uploadResult.Error != null)
                        throw new Exception($"Cloudinary error: {uploadResult.Error.Message}");

                    return uploadResult.SecureUrl.ToString();  // HTTPS public URL
                }
                catch (Exception ex)
                {
                    throw new Exception($"Upload ảnh lỗi: {ex.Message}");
                }
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
                    // Tạo Company KHÔNG có employerId (Company không có field này)
                    company = new Company
                    {
                        companyName = request.CompanyName ?? "Chưa đặt tên"
                    };
                    _context.Companies.Add(company);
                    await _context.SaveChangesAsync();  // Save để lấy ID

                    // Link employer đến company
                    employer.companyId = company.id;
                    _context.Users.Update(employer);
                    await _context.SaveChangesAsync();  // Save link
                }

                // Upload ảnh nếu có file
                string? imageUrl = null;
                if (request.ImageFile != null)
                {
                    imageUrl = await UploadImageToCloudinary(request.ImageFile);
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
                    imageUrl = imageUrl,
                    jobSkills = new List<JobSkill>()
                };

             

            if (request.SkillIds?.Any() == true)
            {
                foreach (var sid in request.SkillIds)
                {
                    if (await _context.Skills.AnyAsync(s => s.id == sid))
                    {
                        job.jobSkills.Add(new JobSkill { skillId = sid });
                        // Không cần gán jobId vì EF sẽ tự làm khi lưu cả cụm
                    }
                }
            }
            await _jobRepository.CreateAsync(job);

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

                // Partial update
                if (!string.IsNullOrEmpty(request.Title)) job.title = request.Title;
                if (!string.IsNullOrEmpty(request.Description)) job.description = request.Description;
                if (!string.IsNullOrEmpty(request.Requirement)) job.requirement = request.Requirement;
                if (!string.IsNullOrEmpty(request.Benefit)) job.benefit = request.Benefit;
                if (request.SalaryMin.HasValue) job.salaryMin = request.SalaryMin.Value;
                if (request.SalaryMax.HasValue) job.salaryMax = request.SalaryMax.Value;

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

                Company? company = job.company;
                if (!string.IsNullOrEmpty(request.CompanyName))
                {
                    if (company == null)
                    {
                        // Tạo mới KHÔNG có employerId
                        company = new Company { companyName = request.CompanyName };
                        _context.Companies.Add(company);
                        await _context.SaveChangesAsync();  // Save để lấy ID
                        job.companyId = company.id;

                        // Optional - Link employer nếu chưa có company
                        var employer = await _context.Users.FindAsync(employerId);
                        if (!employer.companyId.HasValue)
                        {
                            employer.companyId = company.id;
                            _context.Users.Update(employer);
                            await _context.SaveChangesAsync();
                        }
                    }
                    else
                    {
                        company.companyName = request.CompanyName;
                    }
                }

                if (request.JobType.HasValue) job.jobType = request.JobType.Value;

                if (request.Deadline.HasValue)
                {
                    if (request.Deadline <= DateTime.Now)
                        throw new Exception("Deadline phải sau thời điểm hiện tại");
                    job.deadline = request.Deadline.Value;
                }

                if (request.Status.HasValue)
                {
                    var newStatus = request.Status.Value;
                    if (newStatus == JobStatus.Active)
                    {
                        var currentDeadline = request.Deadline ?? job.deadline;
                        if (currentDeadline < DateTime.Now)
                        {
                            throw new Exception("Để hiện job (Active), deadline phải sau thời điểm hiện tại. Vui lòng cập nhật deadline.");
                        }
                        job.status = JobStatus.Active;
                    }
                    else
                    {
                        job.status = newStatus;
                    }
                }

                if (job.status == JobStatus.Active && job.deadline < DateTime.Now)
                {
                    job.status = JobStatus.Expired;
                }

                // Upload ảnh mới nếu có file (thay thế cũ)
                if (request.ImageFile != null)
                {
                    job.imageUrl = await UploadImageToCloudinary(request.ImageFile);
                }

                await _jobRepository.UpdateAsync(job);

            if (request.SkillIds != null)
            {
                // Xóa toàn bộ skill cũ trong collection của đối tượng đang track
                job.jobSkills.Clear();

                // Thêm các skill mới vào chính collection đó
                foreach (var sid in request.SkillIds)
                {
                    // Kiểm tra skill có tồn tại (như code cũ của bạn)
                    if (await _context.Skills.AnyAsync(s => s.id == sid))
                    {
                        job.jobSkills.Add(new JobSkill { jobId = job.id, skillId = sid });
                    }
                }
            }

            _context.Jobs.Update(job);  // Update Job (cascade nếu configured)
                if (company != null) _context.Companies.Update(company);  // Explicit update Company
                await _context.SaveChangesAsync();

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

                // Vẫn cho xóa nếu Expired (không cản)
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

                // Auto-set Expired nếu Active và deadline qua (cho single job)
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

                // Auto-expire cho public list (chỉ trả Active không expired)
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

                // TỰ ĐỘNG KIỂM TRA VÀ SET EXPIRED (cho HR list - họ thấy hết, bao gồm Expired)
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

                // VALIDATE - KHÔNG CHO TOGGLE NẾU EXPIRED
                if (IsExpired(job))
                {
                    throw new Exception("Job đã hết hạn. Vui lòng cập nhật deadline để hiện lại.");
                }

                // Trước set Active, kiểm tra deadline
                if (job.status != JobStatus.Active)
                {
                    if (job.deadline < DateTime.Now)
                    {
                        throw new Exception("Deadline đã qua. Vui lòng cập nhật deadline để hiện job.");
                    }
                }

                // Logic đảo trạng thái (Active <-> Closed)
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

            // Helper method để kiểm tra expired
            private bool IsExpired(Job job)
            {
                return job.status == JobStatus.Expired ||
                       (job.status == JobStatus.Active && job.deadline < DateTime.Now);
            }
        }
}
