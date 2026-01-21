using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Recruitment.API.Data;
using Recruitment.API.DTOs;
using Recruitment.API.Models;
using Recruitment.API.Repositories.Interfaces;
using Recruitment.API.Services.Interfaces;

namespace Recruitment.API.Services
{
    public class ReviewSevice : IReviewService
    {
        private readonly IReviewRepository _repo;
        private readonly IMapper _mapper;
        private readonly AppDbContext _context;
        private IUserRepository _userRepository;
        private IJobRepository _jobRepository;
        private INotificationRepository _notificationRepository;

        public ReviewSevice(IReviewRepository repo, IMapper mapper, AppDbContext context, IUserRepository userRepository, IJobRepository jobRepository, INotificationRepository notificationRepository)
        {
            _repo = repo;
            _mapper = mapper;
            _context = context;
            _userRepository = userRepository;
            _jobRepository = jobRepository;
            _notificationRepository = notificationRepository;
        }

        public async Task<ReviewResponse> PostReviewAsync(int userId, int jobId, ReviewCreateRequest request)
        {
            var job = await _jobRepository.GetByIdAsync(jobId)
                ?? throw new Exception("Không tìm thấy bài tuyển dụng");

            var userReview = await _userRepository.GetByIdAsync(userId);

            var review = new Review { userId = userId, jobId = jobId, rating = request.Rating, comment = request.Comment, createdDate = DateTime.Now };
            await _repo.AddAsync(review);
            var reviewWithUser = await _context.Reviews
                .Include(r => r.user)
                .FirstAsync(r => r.id == review.id);

            if (job.employerId != userId)
            {
                await _notificationRepository.CreateNotificationAsync(
                    job.employerId, "Có bình luận mới", $"{userReview?.fullName} đã bình luận vào bài: {job.title}");
            }
            return _mapper.Map<ReviewResponse>(review);
        }
    }
}
