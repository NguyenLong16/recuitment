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

        // --- CÁC TRƯỜNG MỚI ĐỂ ĐIỀU HƯỚNG ---
        // Phân loại thông báo: "FOLLOW", "APPLY", "COMMENT", "REVIEW", "SYSTEM"
        public string type { get; set; } = string.Empty;

        // ID tham chiếu: Có thể là ID của Follower, ID của Application, hoặc ID của Job
        public int? referenceId { get; set; }
    }
}
