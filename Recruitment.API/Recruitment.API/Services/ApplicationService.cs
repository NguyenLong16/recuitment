using AutoMapper;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.EntityFrameworkCore;
using Recruitment.API.Data;
using Recruitment.API.DTOs;
using Recruitment.API.Models;
using Recruitment.API.Services.Interfaces;
using static Recruitment.API.Data.Enums;

namespace Recruitment.API.Services
{
    public class ApplicationService : IApplicationService
    {
        private readonly AppDbContext _context;
        private readonly Cloudinary _cloudinary;
        private readonly IMapper _mapper;
        public ApplicationService(AppDbContext context, Cloudinary cloudinary, IMapper mapper)
        {
            _context = context;
            _cloudinary = cloudinary;
            _mapper = mapper;
        }

        public async Task<ApplicationResponse> ApplyJobAsync(ApplyJobRequest request, int candidateId)
        {
            var job = await _context.Jobs.FindAsync(request.jobId)
                ?? throw new Exception("Công việc tồn tại");

            if(job.status != JobStatus.Active || job.deadline < DateTime.Now)
            {
                throw new Exception("Công việc đã đóng hoặc hết hạn ứng tuyển");
            }

            var exists = await _context.Applications.AnyAsync(a => a.jobId == request.jobId && a.candidateId == candidateId);
            if (exists)
            {
                throw new Exception("Bạn đã ứng tuyển vào vị trí này rồi");
            }

            var uploadResult = await UploadCvAsync(request.cvFile);

            var application = new Application
            {
                jobId = request.jobId,
                candidateId = candidateId,
                cvUrl = uploadResult, 
                coverLetter = request.coverLetter ?? "",
                appliedDate = DateTime.Now,
                status = ApplicationStatus.Submitted,
            };

            _context.Applications.Add(application);
            await _context.SaveChangesAsync();
            return await GetApplicationByIdAsync(application.id);
        }

        public async Task<IEnumerable<ApplicationResponse>> GetAllApplicationsForEmployerAsync(int employerId)
        {
            var applications = await _context.Applications
                .Include(a => a.candidate) // Để lấy thông tin người ứng tuyển
                .Include(a => a.job)       // Để lấy thông tin công việc (tiêu đề, v.v.)
                .Where(a => a.job.employerId == employerId)
                .OrderByDescending(a => a.appliedDate) // Đơn mới nhất lên đầu
                .ToListAsync();

            // Mapping sang JobResponse (đã bao gồm xử lý SkillNames và JobTitle trong AutoMapper)
            return _mapper.Map<IEnumerable<ApplicationResponse>>(applications);
        }

        public async Task<ApplicationResponse> GetApplicationByIdAsync(int applicationId)
        {
            var application = await _context.Applications
                .Include(a => a.job)
                .Include(a => a.candidate)
                .FirstOrDefaultAsync(a => a.id == applicationId);

            if (application == null)
                throw new Exception("Không tìm thấy đơn ứng tuyển");

            return _mapper.Map<ApplicationResponse>(application);
        }

        public async Task<IEnumerable<ApplicationResponse>> GetApplicationJobIdAsync(int jobId, int employerId)
        {
            var job = await _context.Jobs.FindAsync(jobId);
            if(job == null)
            {
                throw new Exception("Công việc không tồn tại");
            }
            if(job.employerId != employerId)
            {
                throw new Exception("Bạn không có quyền xem ứng viên của công việc này");
            }

            var applications = await _context.Applications
                .Include(a => a.candidate)
                .Include(a => a.job)
                .Where(a => a.jobId == jobId)
                .OrderByDescending(a => a.appliedDate)
                .ToListAsync();

            return _mapper.Map<IEnumerable<ApplicationResponse>>(applications);
        }

        public async Task<IEnumerable<ApplicationResponse>> GetApplicationsByCandidateAsync(int candidateId)
        {
            var applications = await _context.Applications
                .Include(a => a.job)
                .Include(a => a.candidate)    // Để lấy CandidateName
                .Where(a => a.candidateId == candidateId)
                .OrderByDescending(a => a.appliedDate) // Đơn mới nhất lên đầu
                .ToListAsync();

            return _mapper.Map<IEnumerable<ApplicationResponse>>(applications);
        }

        public async Task<ApplicationResponse> UpdateApplicationStatusAsync(int applicationId, ApplicationStatus newStatus, int employerId)
        {
            var application = await _context.Applications
                .Include(a => a.job)
                .Include(a => a.candidate)
                .FirstOrDefaultAsync(a => a.id == applicationId)
                ?? throw new Exception("Không tìm thấy đơn ứng tuyển");

            if (application.job.employerId != employerId)
                throw new Exception("Bạn không có quyền thao tác trên đơn ứng tuyển này");

            application.status = newStatus;

            string statusText = GetStatusVietnamese(newStatus);
            var notification = new Notification
            {
                userId = application.candidateId,
                applicationId = application.id,
                title = "Cập nhật trạng thái hồ sơ",
                content = $"Hồ sơ ứng tuyển vị trí \"{application.job.title}\" đã được cập nhật sang trạng thái: {statusText}",
                createDate = DateTime.Now,
                isRead = false,
            };

            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();
            return _mapper.Map<ApplicationResponse>(application);
        }

        private string GetStatusVietnamese(ApplicationStatus status)
        {
            return status switch
            {
                ApplicationStatus.Submitted => "Đã nộp",
                ApplicationStatus.Viewed => "Đang xem hồ sơ",
                ApplicationStatus.Interview => "Mời phỏng vấn",
                ApplicationStatus.Rejected => "Từ chối",
                ApplicationStatus.Accepted => "Trúng tuyển",
                _ => status.ToString()
            };
        }

        private async Task<string> UploadCvAsync(IFormFile file)
        {
            if (file == null || file.Length == 0) throw new Exception("Vui lòng đính kèm CV");

            using var stream = file.OpenReadStream();
            var uploadParams = new RawUploadParams // Dùng Raw cho file PDF/Doc
            {
                File = new FileDescription(file.FileName, stream),
                Folder = "resumes",
                AccessMode = "public"
            };

            var result = await _cloudinary.UploadAsync(uploadParams);
            return result.SecureUrl.ToString();
        }
    }
}
