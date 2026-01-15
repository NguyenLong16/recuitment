using Recruitment.API.Models;
using System.ComponentModel.DataAnnotations.Schema;

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
}
