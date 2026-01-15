using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Recruitment.API.Models
{
    public class User
    {
        [Key]
        public int id { get; set; }
        [Required]
        [MaxLength(100)]
        public string fullName { get; set; }
        [Required]
        public string email { get; set; }
        public string address { get; set; }
        [Required]
        public string passwordHash { get; set; }
        public string? phoneNumber { get; set; }
        public string? AvatarUrl { get; set; }
        [MaxLength(200)]
        public string? professionalTitle { get; set; } // Ví dụ: Senior Dev hoặc HR Manager
        public string? bio { get; set; }
        public string? websiteUrl { get; set; }
        public string? linkedInUrl { get; set; }
        public string? githubUrl { get; set; }
        public string? coverImageUrl { get; set; } // Ảnh bìa cho Profile
        public string? defaultCvUrl { get; set; }
        public DateTime? createdDate { get; set; } = DateTime.Now;
        public int roleId { get; set; }
        [ForeignKey("roleId")]
        public virtual Role role { get; set; }
        public int? companyId { get; set; } // Dấu ? cho phép null (vì ứng viên không có công ty)

        [ForeignKey("companyId")]
        public virtual Company company { get; set; }
        public virtual ICollection<Education> educations { get; set; }
        public virtual ICollection<Experience> experiences { get; set; }

        // 1 User (Candidate) có nhiều đơn ứng tuyển
        public virtual ICollection<Application> applications { get; set; }

        // 1 User (Employer) có thể đăng nhiều Job
        [InverseProperty("Employer")]
        public virtual ICollection<Job> postedJobs { get; set; }
        // Mối quan hệ Theo dõi (Follow)
        public virtual ICollection<Follow> followers { get; set; } // Những người theo dõi mình (nếu mình là HR)
        public virtual ICollection<Follow> following { get; set; } // Những người mình đang theo dõi (nếu mình là Candidate)
    }
}
