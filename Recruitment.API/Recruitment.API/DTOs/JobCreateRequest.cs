using System.ComponentModel.DataAnnotations;
using static Recruitment.API.Data.Enums;

namespace Recruitment.API.DTOs
{
    public class JobCreateRequest
    {
        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Description { get; set; } = string.Empty;

        [Required]
        public string Requirement { get; set; } = string.Empty;

        public string Benefit { get; set; } = string.Empty;

        public decimal? SalaryMin { get; set; }
        public decimal? SalaryMax { get; set; }

        [Required]
        [StringLength(200, ErrorMessage = "Tên công ty không quá 200 ký tự")]
        public string? CompanyName { get; set; }

        [Required]
        public int LocationId { get; set; }
        [Required]
        public int CategoryId { get; set; }

        [Required]
        public JobType JobType { get; set; }

        [Required]
        public DateTime Deadline { get; set; }

        public List<int> SkillIds { get; set; } = new List<int>();

        // THÊM: File upload (optional, gộp vào request)
        public IFormFile? ImageFile { get; set; }
    }

    public class JobResponse
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Requirement { get; set; } = string.Empty;
        public string Benefit { get; set; } = string.Empty;
        public decimal? SalaryMin { get; set; }
        public decimal? SalaryMax { get; set; }
        public string LocationName { get; set; } = string.Empty;
        public string CategoryName { get; set; } = string.Empty;
        public string JobType { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime Deadline { get; set; }
        public DateTime CreatedDate { get; set; }
        public string CompanyName { get; set; } = string.Empty;
        public string EmployerName { get; set; } = string.Empty;
        public List<string> SkillNames { get; set; } = new List<string>();
        public int LocationId { get; set; }
        public int CategoryId { get; set; }
        public List<int> SkillIds { get; set; } = new();
        public string? ImageUrl { get; set; }  // THAY: ImageUrl (Cloudinary URL)
    }

    public class JobUpdateRequest
    {
        // Các properties cơ bản (nullable cho partial)
        [MaxLength(200)]
        public string? Title { get; set; }

        [MaxLength(200)]
        public string? CompanyName { get; set; }

        public string? Description { get; set; }
        public string? Requirement { get; set; }
        public string? Benefit { get; set; }

        public decimal? SalaryMin { get; set; }
        public decimal? SalaryMax { get; set; }

        public int? LocationId { get; set; }
        public int? CategoryId { get; set; }

        public JobType? JobType { get; set; }
        public JobStatus? Status { get; set; }
        public DateTime? Deadline { get; set; }

        public List<int>? SkillIds { get; set; }

        // THÊM: File upload (optional, nếu có thì thay thế)
        public IFormFile? ImageFile { get; set; }
    }
    
}
