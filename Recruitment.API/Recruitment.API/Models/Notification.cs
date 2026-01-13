using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Recruitment.API.Models
{
    public class Notification
    {
        [Key]
        public int id { get; set; }
        public int userId { get; set; }
        [ForeignKey("userId")]
        public virtual User user { get; set; }
        public string title { get; set; } = string.Empty;
        public string content { get; set; } = string.Empty;
        public bool isRead { get; set; } = false;
        public DateTime createDate { get; set; } = DateTime.Now;
        // Liên kết với Application nếu cần để dẫn link sang chi tiết
        public int? applicationId { get; set; }
    }
}
