using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Recruitment.API.Models
{
    public class UserRefreshToken
    {
        [Key]
        public int id { get; set; }

        [Required]
        public string token { get; set; }

        public DateTime expiresAt { get; set; }

        public DateTime createdAt { get; set; } = DateTime.UtcNow;

        public bool isRevoked { get; set; } = false;

        // FK -> User
        public int userId { get; set; }

        [ForeignKey("userId")]
        public virtual User user { get; set; }
    }
}
