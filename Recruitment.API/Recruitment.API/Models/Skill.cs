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
        public virtual ICollection<UserSkill> userSkills { get; set; } = new List<UserSkill>();
    }
}
