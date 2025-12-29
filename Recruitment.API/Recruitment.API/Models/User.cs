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
        [Required]
        public string passwordHash { get; set; }
        public string? phoneNumber { get; set; }
        public string? AvatarUrl { get; set; }
        public DateTime? createdDate { get; set; } = DateTime.Now;
        public int roleId { get; set; }
        [ForeignKey("roleId")]
        public virtual Role role { get; set; }
        public virtual ICollection<Education> educations { get; set; }
        public virtual ICollection<Experience> experiences { get; set; }

        // 1 User (Candidate) có nhiều đơn ứng tuyển
        public virtual ICollection<Application> applications { get; set; }

        // 1 User (Employer) có thể đăng nhiều Job
        [InverseProperty("Employer")]
        public virtual ICollection<Job> postedJobs { get; set; }
    }
}
