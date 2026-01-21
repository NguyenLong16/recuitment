using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Recruitment.API.Models
{
    public class Comment
    {
        [Key]
        public int id { get; set; }
        [Required]
        public string content { get; set; }
        public DateTime createdDate { get; set; } = DateTime.Now;

        public int userId { get; set; }
        [ForeignKey("userId")]
        public virtual User user { get; set; }

        public int jobId { get; set; }
        [ForeignKey("jobId")]
        public virtual Job job { get; set; }
    }
}
