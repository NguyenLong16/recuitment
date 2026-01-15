using System.ComponentModel.DataAnnotations.Schema;

namespace Recruitment.API.Models
{
    public class Follow
    {
        public int id { get; set; } // ID ứng viên nhấn theo dõi
        [ForeignKey("followerId")]
        public virtual User follower { get; set; }

        public int employerId { get; set; } // ID của HR được theo dõi
        [ForeignKey("employerId")]
        public virtual User employer { get; set; }

        public DateTime createdDate { get; set; } = DateTime.Now;
    }
}
