using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;
using static Recruitment.API.Data.Enums;
using static System.Net.Mime.MediaTypeNames;

namespace Recruitment.API.Models
{
    public class Job
    {
        [Key]
        public int id { get; set; }
        [Required]
        [MaxLength(200)]
        public string title { get; set; } //Tên công việc
        public string description { get; set; } //Mô tả
        public string requirement { get; set; } // Yêu cầu công việc
        public string benefit { get; set; } // Phúc lợi
        // Mức lương (Có thể null nếu là "Thỏa thuận")
        //hỏi lại
        public decimal? salaryMin { get; set; }
        public decimal? salaryMax { get; set; }
        public int locationId { get; set; }
        [ForeignKey("locationId")]
        public virtual Location location { get; set; }
        public JobType jobType { get; set; }
        public JobStatus status { get; set; }
        public DateTime deadline { get; set; }
        public DateTime createdDate { get; set; } = DateTime.Now;
        public int companyId { get; set; }
        [ForeignKey("companyId")]
        public virtual Company company { get; set; }

        public int categoryId { get; set; }
        [ForeignKey("categoryId")]
        public virtual Category category { get; set; }

        public int employerId { get; set; } // Người đăng
        [ForeignKey("employerId")]
        public virtual User employer { get; set; }

        // --- Collections ---
        public virtual ICollection<JobSkill> jobSkills { get; set; }
        public virtual ICollection<Application> applications { get; set; }
        public string? imageFile{ get; set; }

    }
}
