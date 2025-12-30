using System.ComponentModel.DataAnnotations;

namespace Recruitment.API.Models
{
    public class Location
    {
        [Key]
        public int id { get; set; }
        [Required]
        public string name { get; set; } 

        public virtual ICollection<Job> jobs { get; set; }
    }
}
