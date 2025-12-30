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

        public int LocationId { get; set; }
        public int CategoryId { get; set; }

        [Required]
        public JobType JobType { get; set; }

        [Required]
        public DateTime Deadline { get; set; }

        public List<int> SkillIds { get; set; } = new List<int>();
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
    }

    public class JobUpdateRequest
    {
        [Required]
        public int Id { get; set; }

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

        public int LocationId { get; set; }
        public int CategoryId { get; set; }

        [Required]
        public JobType JobType { get; set; }

        [Required]
        public DateTime Deadline { get; set; }

        public List<int> SkillIds { get; set; } = new List<int>();
    }
}
