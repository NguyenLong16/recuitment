using AutoMapper;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.EntityFrameworkCore;
using Recruitment.API.Data;
using Recruitment.API.DTOs;
using Recruitment.API.Models;
using Recruitment.API.Repositories;
using Recruitment.API.Repositories.Interfaces;
using Recruitment.API.Services.Interfaces;

namespace Recruitment.API.Services
{
    public class ProfileService : IProfileService
    {
        private readonly IUserRepository _userRepository;
        private readonly IProfileRepository _profileRepository;
        private readonly INotificationRepository _notificationRepository;
        private readonly Cloudinary _cloudinary;
        private readonly IMapper _mapper;
        private readonly AppDbContext _context;
        public ProfileService(IUserRepository userRepository, Cloudinary cloudinary, IMapper mapper, IProfileRepository profileRepository, INotificationRepository notificationRepository, AppDbContext context   )
        {
            _userRepository = userRepository;
            _cloudinary = cloudinary;
            _mapper = mapper;
            _profileRepository = profileRepository;
            _notificationRepository = notificationRepository;
            _context = context;
        }

        public async Task<UserProfileResponse> GetProfileAsync(int userId, int? currentViewerId = null)
        {
            // 1. Gọi Repository để lấy dữ liệu thô từ DB
            var user = await _profileRepository.GetUserWithDetailsAsync(userId)
                ?? throw new Exception("Không tìm thấy người dùng");

            // 2. Chuyển đổi sang DTO bằng AutoMapper
            var profile = _mapper.Map<UserProfileResponse>(user);

            // 3. Gán các thông tin bổ sung
            profile.roleName = user.role.roleName;
            profile.FollowerCount = user.followers?.Count ?? 0;

            // 4. Xử lý logic kiểm tra trạng thái Follow (nếu có người đang xem profile người khác)
            if (currentViewerId.HasValue && currentViewerId != userId)
            {
                profile.IsFollowing = await _profileRepository.IsFollowingAsync(currentViewerId.Value, userId);
            }

            return profile;
        }

        public async Task<UserProfileResponse> UpdateProfileUser(int id, ProfileUpdateRequest request)
        {
            var user = await _userRepository.GetByIdAsync(id) ?? throw new Exception("Người dùng không tồn tại");
            if (!string.IsNullOrEmpty(request.ProfessionalTitle)) user.professionalTitle = request.ProfessionalTitle;
            if (!string.IsNullOrEmpty(request.Bio)) user.bio = request.Bio;
            if (!string.IsNullOrEmpty(request.Address)) user.address = request.Address;
            user.websiteUrl = request.WebsiteUrl;
            user.linkedInUrl = request.LinkedInUrl;
            user.githubUrl = request.GitHubUrl;

            if (request.AvatarFile != null)
            {
                user.AvatarUrl = await UploadMediaAsync(request.AvatarFile, "avatar", true);
            }

            if(request.CoverFile != null)
            {
                user.coverImageUrl = await UploadMediaAsync(request.CoverFile, "coverImageUrl", true);
            }

            if(request.CvFile != null)
            {
                user.defaultCvUrl = await UploadMediaAsync(request.CvFile, "resumes", false);
            }

            if (user.role.roleName == "Employer")
            {
                // TRƯỜNG HỢP 1: Chọn công ty có sẵn
                if (request.CompanyId.HasValue && request.CompanyId > 0)
                {
                    var existingCompany = await _context.Companies.FindAsync(request.CompanyId.Value);
                    if (existingCompany != null)
                    {
                        user.companyId = existingCompany.id;
                    }
                }
                // TRƯỜNG HỢP 2: Tạo công ty mới (Nếu nhập tên công ty mới)
                else if (!string.IsNullOrEmpty(request.NewCompanyName))
                {
                    // Kiểm tra xem công ty này đã tồn tại chưa để tránh trùng lặp
                    var existingCompany = await _context.Companies
                        .FirstOrDefaultAsync(c => c.companyName.ToLower() == request.NewCompanyName.ToLower());

                    if (existingCompany != null)
                    {
                        user.companyId = existingCompany.id; // Nếu có rồi thì link luôn
                    }
                    else
                    {
                        // Tạo mới
                        var newCompany = new Company
                        {
                            companyName = request.NewCompanyName,
                            websiteLink = request.CompanyWebsite, // Cập nhật link site
                            address = request.CompanyAddress,
                            size = 0 // Mặc định
                        };
                        _context.Companies.Add(newCompany);
                        await _context.SaveChangesAsync(); // Save để lấy ID

                        user.companyId = newCompany.id; // Link user vào công ty mới
                    }
                }

                // TRƯỜNG HỢP 3: Cập nhật thông tin công ty hiện tại (Ví dụ: Update Link Website)
                if (user.companyId.HasValue)
                {
                    var myCompany = await _context.Companies.FindAsync(user.companyId.Value);
                    if (myCompany != null)
                    {
                        if (!string.IsNullOrEmpty(request.CompanyWebsite)) myCompany.websiteLink = request.CompanyWebsite;
                        if (!string.IsNullOrEmpty(request.CompanyAddress)) myCompany.address = request.CompanyAddress;
                        // Cập nhật lại Company
                        _context.Companies.Update(myCompany);
                    }
                }
            }

            await _userRepository.UpdateAsync(user);

            var response = _mapper.Map<UserProfileResponse>(user);
            response.DefaultCvUrl = user.defaultCvUrl;

            if (user.companyId.HasValue)
            {
                // Load lại company để trả về response đầy đủ nhất (vì vừa có thể bị sửa link website)
                var company = await _context.Companies.FindAsync(user.companyId.Value);
                response.Company = _mapper.Map<CompanyResponse>(company);
            }

            return response;

        }

        public async Task FollowHRAsync(int followerId, int employerId)
        {
            // 1. Kiểm tra không cho tự follow chính mình
            if (followerId == employerId)
                throw new Exception("Bạn không thể theo dõi chính mình");

            // 2. Kiểm tra xem đã follow chưa
            var isExisting = await _profileRepository.IsFollowingAsync(followerId, employerId);
            if (isExisting)
                throw new Exception("Bạn đã theo dõi nhà tuyển dụng này rồi");

            // 3. Kiểm tra vai trò (Chỉ cho phép Candidate follow Employer/HR)
            var employer = await _userRepository.GetByIdAsync(employerId);
            if (employer == null || employer.role.roleName != "Employer") // Hoặc "HR" tùy database của bạn
                throw new Exception("Người dùng này không phải là nhà tuyển dụng");

            // 4. Lưu vào database
            var follow = new Follow
            {
                id = followerId,
                employerId = employerId,
                createdDate = DateTime.Now
            };

            await _profileRepository.AddFollowAsync(follow);

            try
            {
                // Lấy tên ứng viên (người nhấn follow)
                var follower = await _userRepository.GetByIdAsync(followerId);

                var notification = new Notification
                {
                    userId = employerId, // Người nhận là HR
                    title = "Bạn có người theo dõi mới",
                    content = $"{follower?.fullName} đã bắt đầu theo dõi bạn.",
                    isRead = false,
                    createDate = DateTime.Now,
                    applicationId = null // Không liên quan đến đơn ứng tuyển
                };

                await _notificationRepository.CreateAsync(notification);
            }
            catch (Exception ex)
            {
                // Chỉ log lỗi, không chặn luồng follow chính
                Console.WriteLine($"Lỗi gửi thông báo Follow: {ex.Message}");
            }
        }

        public async Task UnfollowHRAsync(int followerId, int employerId)
        {
            var followRecord = await _profileRepository.GetFollowRecordAsync(followerId, employerId);
            if (followRecord == null)
                throw new Exception("Bạn chưa theo dõi người này");

            await _profileRepository.RemoveFollowAsync(followRecord);

            try
            {
                // Lấy thông tin người bỏ theo dõi
                var follower = await _userRepository.GetByIdAsync(followerId);

                var notification = new Notification
                {
                    userId = employerId, // Người nhận là HR
                    title = "Thông báo thay đổi lượt theo dõi",
                    content = $"{follower?.fullName} đã ngừng theo dõi trang cá nhân của bạn.",
                    isRead = false,
                    createDate = DateTime.Now,
                    applicationId = null
                };

                // Lưu thông báo vào bảng Notifications
                await _notificationRepository.CreateAsync(notification);
            }
            catch (Exception ex)
            {
                // Log lỗi để không làm treo luồng Unfollow chính
                Console.WriteLine($"Lỗi gửi thông báo Unfollow: {ex.Message}");
            }
        }

        private async Task<string> UploadMediaAsync(IFormFile file, string folder, bool isImage)
        {
            using var stream = file.OpenReadStream();
            RawUploadParams uploadParams;

            if (isImage)
            {
                uploadParams = new ImageUploadParams
                {
                    File = new FileDescription(file.FileName, stream),
                    Folder = folder,
                    Transformation = new Transformation().Width(500).Height(500).Crop("fill")
                };
            }
            else
            {
                uploadParams = new RawUploadParams
                {
                    File = new FileDescription(file.FileName, stream),
                    Folder = folder,
                    AccessMode = "public"
                };
            }

            var result = await _cloudinary.UploadAsync(uploadParams);
            return result.SecureUrl.ToString();
        }

        Task<string> IProfileService.UploadMediaAsync(IFormFile file, string folder, bool isImage)
        {
            return UploadMediaAsync(file, folder, isImage);
        }

        public async Task<IEnumerable<UserSummaryResponse>> GetFollowersAsync(int employerId)
        {
            var follows = await _profileRepository.GetFollowersByEmployerIdAsync(employerId);

            // Ánh xạ từ danh sách Follow sang danh sách UserSummaryResponse
            return follows.Select(f => new UserSummaryResponse
            {
                Id = f.follower.id,
                FullName = f.follower.fullName,
                AvatarUrl = f.follower.AvatarUrl,
                ProfessionalTitle = f.follower.professionalTitle
            });
        }
    }
}
