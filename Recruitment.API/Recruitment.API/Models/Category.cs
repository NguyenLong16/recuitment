using System.ComponentModel.DataAnnotations;

namespace Recruitment.API.Models
{
    public class Category
    {
        [Key]
        public int id { get; set; }
        [Required]
        public string name { get; set; }
        //Một danh mục có nhiều job
        public virtual ICollection<Job> jobs { get; set; }
    }
}
