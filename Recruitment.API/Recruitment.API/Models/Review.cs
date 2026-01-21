using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Recruitment.API.Models
{
    public class Review
    {
        [Key]
        public int id { get; set; }
        [Range(1, 5)]
        public int rating { get; set; } // Số sao từ 1-5
        public string? comment { get; set; }
        public DateTime createdDate { get; set; } = DateTime.Now;

        public int userId { get; set; }
        [ForeignKey("userId")]
        public virtual User user { get; set; }

        public int jobId { get; set; }
        [ForeignKey("jobId")]
        public virtual Job job { get; set; }
    }
}
