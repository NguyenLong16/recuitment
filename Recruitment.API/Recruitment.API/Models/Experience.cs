using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Recruitment.API.Models
{
    public class Experience
    {
        [Key]
        public int id { get; set; }
        public int userId { get; set; }
        [ForeignKey("userId")]
        public virtual User user { get; set; }
        public string companyName { get; set; }
        public string position { get; set; }
        public string? description { get; set; }
        public DateTime startDate { get; set; }
        public DateTime? endDate { get; set; } // Nullable nếu đang làm
    }
}
