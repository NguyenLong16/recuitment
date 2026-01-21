using System.ComponentModel.DataAnnotations.Schema;

namespace Recruitment.API.Models
{
    public class SavedJob
    {
        public int userId { get; set; }
        [ForeignKey("userId")]
        public virtual User user { get; set; }

        public int jobId { get; set; }
        [ForeignKey("jobId")]
        public virtual Job job { get; set; }

        public DateTime savedDate { get; set; } = DateTime.Now;
    }
}
