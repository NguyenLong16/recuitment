using System.ComponentModel.DataAnnotations;

namespace Recruitment.API.DTOs
{
    public class EducationDto
    {
        public int id { get; set; }
        public string schoolName { get; set; }
        public string major { get; set; }
        public DateTime startDate { get; set; }
        public DateTime? endDate { get; set; }
    }

    public class EducationRequest
    {
        [Required]
        public string SchoolName { get; set; } = string.Empty;
        [Required]
        public string Major { get; set; } = string.Empty;
        [Required]
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }
}

