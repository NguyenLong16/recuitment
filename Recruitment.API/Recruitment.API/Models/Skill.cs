using System.ComponentModel.DataAnnotations;

namespace Recruitment.API.Models
{
    public class Skill
    {
        [Key]
        public int id { get; set; }
        [Required]
        public string skillName { get; set; }
        public virtual ICollection<JobSkill> jobSkills { get; set; }
    }
}
