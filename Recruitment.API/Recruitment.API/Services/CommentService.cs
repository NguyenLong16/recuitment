using AutoMapper;
using Recruitment.API.DTOs;
using Recruitment.API.Models;
using Recruitment.API.Repositories.Interfaces;
using Recruitment.API.Services.Interfaces;

namespace Recruitment.API.Services
{
    public class CommentService : ICommentService
    {
        private readonly ICommentRepository _repo;
        private readonly IMapper _mapper;
        private readonly IJobRepository _jobRepository;
        private readonly INotificationRepository _notificationRepository;
        private readonly IUserRepository _userRepository;

        public CommentService(ICommentRepository repo, IMapper mapper, IJobRepository jobRepository, INotificationRepository notificationRepository, IUserRepository userRepository)
        {
            _repo = repo;
            _mapper = mapper;
            _jobRepository = jobRepository;
            _notificationRepository = notificationRepository;
            _userRepository = userRepository;
        }

        public async Task<CommentResponse> PostCommentAsync(int userId, int jobId, CommentCreateRequest request)
        {
            var job = await _jobRepository.GetByIdAsync(jobId)
                ?? throw new Exception("Không tìm thấy bài tuyển dụng");

            var userComment = await _userRepository.GetByIdAsync(userId);

            var comment = new Comment { userId = userId, jobId = jobId, content = request.Content, createdDate = DateTime.Now };
            await _repo.AddAsync(comment);

            if(job.employerId != userId)
            {
                await _notificationRepository.CreateNotificationAsync(
                    job.employerId, "Có đánh giá mới", $"{userComment?.fullName} đã đánh giá vào bài: {job.title}");
            }

            return _mapper.Map<CommentResponse>(comment);
        }

        public async Task<IEnumerable<CommentResponse>> GetJobCommentsAsync(int jobId)
        {
            var comments = await _repo.GetByJobIdAsync(jobId);
            return _mapper.Map<IEnumerable<CommentResponse>>(comments);
        }
    }
}
