namespace Recruitment.API.DTOs
{
    public class AdminUserResponse
    {
        public int Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; }
        public string? AvatarUrl { get; set; }
        public string RoleName { get; set; } = string.Empty; // Để Admin biết là Admin, HR hay Candidate
        public string? CompanyName { get; set; } // Tên công ty nếu user này là HR
        public DateTime? CreatedDate { get; set; }
        public bool IsActive { get; set; }
    }
}
