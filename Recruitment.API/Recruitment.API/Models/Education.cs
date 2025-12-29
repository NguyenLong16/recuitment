using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Recruitment.API.Models
{
    public class Education
    {
        [Key]
        public int id { get; set; }
        public int userId { get; set; }
        [ForeignKey("userId")]
        public virtual User user { get; set; }
        public string schoolName { get; set; }
        public string major { get; set; }
        public DateTime startDate { get; set; }
        public DateTime endDate { get; set; }
    }
}
