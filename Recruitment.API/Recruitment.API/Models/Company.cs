using System.ComponentModel.DataAnnotations;

namespace Recruitment.API.Models
{
    public class Company
    {
        [Key]
        public int id { get; set; }
        [Required]
        public string companyName { get; set; }
        public string? logoUrl { get; set; }
        public string? description { get; set; }
        public string? websiteLink { get; set; }
        public string? address { get; set; }
        public int size { get; set; } // số lượng nhân viên
        // 1 Công ty có nhiều Job
        public virtual ICollection<Job> Jobs { get; set; }
    }
}
