using System.ComponentModel.DataAnnotations;

namespace Recruitment.API.Models
{
    public class Role
    {
        [Key]
        public int id { get; set; }
        [Required]
        [MaxLength(50)]
        public string roleName { get; set; } //Admin, HR, Candidate
        public virtual ICollection<User> user { get; set; }
    }
}
