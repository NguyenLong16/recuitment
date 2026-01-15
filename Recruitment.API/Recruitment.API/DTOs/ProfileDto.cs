namespace Recruitment.API.DTOs
{
    public class UserProfileResponse
    {
        public int id {  get; set; }
        public string fullName { get; set; } = string.Empty;
        public string email { get; set; } = string.Empty;
        public string? phoneNumber { get; set; }
        public string? avatarUrl { get; set; }
        public string? coverImageUrl { get; set; }
        public string? professionalTitle { get; set; }
        public string? bio { get; set; }
        public string? address { get; set; }
        public string? roleName { get; set; }
        // Social Links
        public string? WebsiteUrl { get; set; }
        public string? LinkedInUrl { get; set; }
        public string? GitHubUrl { get; set; }
        public List<EducationDto>? Educations { get; set; }
        public List<ExperienceDTO>? Experiences { get; set; }
        public string? DefaultCvUrl { get; set; }
        // Dành cho HR
        public CompanyResponse? Company { get; set; }
        public List<JobResponse>? PostedJobs { get; set; }
        public int FollowerCount { get; set; }
        public bool IsFollowing { get; set; } // Trạng thái người xem có đang follow người này không
    }

    public class ProfileUpdateRequest
    {
        public string? FullName { get; set; }
        public string? PhoneNumber { get; set; }

        // Thông tin bổ sung
        public string? ProfessionalTitle { get; set; }
        public string? Bio { get; set; }
        public string? Address { get; set; }
        public string? WebsiteUrl { get; set; }
        public string? LinkedInUrl { get; set; }
        public string? GitHubUrl { get; set; }

        // Các file đính kèm
        public IFormFile? AvatarFile { get; set; }
        public IFormFile? CoverFile { get; set; }
        public IFormFile? CvFile { get; set; }
    }

    public class UserSummaryResponse // DTO rút gọn cho danh sách
    {
        public int Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string? AvatarUrl { get; set; }
        public string? ProfessionalTitle { get; set; }
    }
}
