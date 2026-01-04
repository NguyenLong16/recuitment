using System.ComponentModel.DataAnnotations;
using static Recruitment.API.Data.Enums;

namespace Recruitment.API.DTOs
{
    public class JobCreateRequest
    {
        [Required]
        [MaxLength(200)]
        public string Title { get; set; }

        [Required]
        public string Description { get; set; }

        [Required]
        public string Requirement { get; set; }

        public string Benefit { get; set; }

        public decimal? SalaryMin { get; set; }
        public decimal? SalaryMax { get; set; }
        [Required]
        [StringLength(200, ErrorMessage = "Tên công ty không quá 200 ký tự")]
        public string? CompanyName { get; set; }

        public int LocationId { get; set; }
        public int CategoryId { get; set; }

        [Required]
        public JobType JobType { get; set; }

        [Required]
        public DateTime Deadline { get; set; }

        public List<int> SkillIds { get; set; } = new List<int>();
        public string? ImageFile { get; set; }
    }

    public class JobResponse
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Requirement { get; set; }
        public string Benefit { get; set; }
        public decimal? SalaryMin { get; set; }
        public decimal? SalaryMax { get; set; }
        public string LocationName { get; set; }
        public string CategoryName { get; set; }
        public string JobType { get; set; }
        public string Status { get; set; }
        public DateTime Deadline { get; set; }
        public DateTime CreatedDate { get; set; }
        public string CompanyName { get; set; }
        public string EmployerName { get; set; }
        public List<string> SkillNames { get; set; }
        public int LocationId { get; set; }
        public int CategoryId { get; set; }
        public int SkillIds { get; set; }
        public string? ImageFile { get; set; }
    }

    public class JobUpdateRequest
    {
        // Các properties cơ bản (nullable cho partial)
        [StringLength(200, ErrorMessage = "Tiêu đề không quá 200 ký tự")]
        public string? Title { get; set; }  // THÊM: Phải có để tránh CS1061
        [StringLength(200, ErrorMessage = "Tên công ty không quá 200 ký tự")]
        public string? CompanyName { get; set; }

        [StringLength(2000)]
        public string? Description { get; set; }  // THÊM

        [StringLength(2000)]
        public string? Requirement { get; set; }  // THÊM

        [StringLength(1000)]
        public string? Benefit { get; set; }  // THÊM

        [Range(0, 1000000000, ErrorMessage = "Lương tối thiểu phải >= 0")]
        public decimal? SalaryMin { get; set; }  // THÊM

        [Range(0, 1000000000, ErrorMessage = "Lương tối đa phải >= 0")]
        public decimal? SalaryMax { get; set; }  // THÊM

        [Range(1, int.MaxValue, ErrorMessage = "LocationId phải hợp lệ")]
        public int? LocationId { get; set; }  // THÊM

        [Range(1, int.MaxValue, ErrorMessage = "CategoryId phải hợp lệ")]
        public int? CategoryId { get; set; }  // THÊM

        // Enum nullable (gửi null để không update)
        public JobType? JobType { get; set; }  // THÊM (giả sử JobType là enum)

        public JobStatus? Status { get; set; }  // THÊM (tích hợp auto-hide)

        // Deadline nullable
        public DateTime? Deadline { get; set; }  // THÊM

        // Skills: List nullable, nhưng nếu gửi thì thay thế
        public List<int>? SkillIds { get; set; } = new();  // THÊM (empty list nếu null)
        public string? ImageFile { get; set; }
    }
}
