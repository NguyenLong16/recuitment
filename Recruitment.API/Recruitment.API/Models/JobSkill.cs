using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Recruitment.API.Models
{
    public class JobSkill
    {
        public int jobId { get; set; }
        [ForeignKey("jobId")]
        public virtual Job job { get; set; }
        public int skillId { get; set; }
        [ForeignKey("skillId")]
        public virtual Skill skill { get; set; }
    }
}
