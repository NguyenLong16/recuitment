using System.ComponentModel.DataAnnotations;

namespace Recruitment.API.DTOs
{
    public class ExperienceDTO
    {
        public int id { get; set; }
        public string companyName { get; set; }
        public string position { get; set; }
        public string? description { get; set; }
        public DateTime startDate { get; set; }
        public DateTime? endDate { get; set; }
    }

    public class ExperienceRequest
    {
        [Required]
        public string CompanyName { get; set; } = string.Empty;
        [Required]
        public string Position { get; set; } = string.Empty;
        public string? Description { get; set; }
        [Required]
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }
}
