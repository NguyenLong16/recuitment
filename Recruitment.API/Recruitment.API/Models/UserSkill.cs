using System.ComponentModel.DataAnnotations.Schema;

namespace Recruitment.API.Models
{
    public class UserSkill
    {
        public int userId { get; set; }
        [ForeignKey("userId")]
        public virtual User user { get; set; }

        public int skillId { get; set; }
        [ForeignKey("skillId")]
        public virtual Skill skill { get; set; }
    }
}
