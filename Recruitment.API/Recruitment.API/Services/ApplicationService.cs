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

        public async Task<IEnumerable<ApplicationResponse>> GetApplicationsByCandidateAsync(int candidateId)
        {
            var applications = await _context.Applications
                .Include(a => a.job)          // Để lấy JobTitle
                .Include(a => a.candidate)    // Để lấy CandidateName
                .Where(a => a.candidateId == candidateId)
                .OrderByDescending(a => a.appliedDate) // Đơn mới nhất lên đầu
                .ToListAsync();

            return _mapper.Map<IEnumerable<ApplicationResponse>>(applications);
        }

        private async Task<string> UploadCvAsync(IFormFile file)
        {
            if (file == null || file.Length == 0) throw new Exception("Vui lòng đính kèm CV");

            using var stream = file.OpenReadStream();
            var uploadParams = new RawUploadParams // Dùng Raw cho file PDF/Doc
            {
                File = new FileDescription(file.FileName, stream),
                Folder = "resumes"
            };

            var result = await _cloudinary.UploadAsync(uploadParams);
            return result.SecureUrl.ToString();
        }
    }
}
