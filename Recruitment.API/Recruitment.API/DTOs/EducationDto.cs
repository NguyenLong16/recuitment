using Recruitment.API.Models;
using System.ComponentModel.DataAnnotations.Schema;

namespace Recruitment.API.DTOs
{
    public class EducationDto
    {
        public int id { get; set; }
        public string schoolName { get; set; }
        public string major { get; set; }
        public DateTime startDate { get; set; }
        public DateTime endDate { get; set; }
    }
}

