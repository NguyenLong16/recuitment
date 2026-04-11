using System.ComponentModel.DataAnnotations;

namespace Recruitment.API.DTOs
{
    public class SkillResponse
    {
        public int id { get; set; }
        public string skillName { get; set; }
    }

    public class SkillRequest
    {
        [Required(ErrorMessage = "Tên kỹ năng không được để trống")]
        [MaxLength(100, ErrorMessage = "Tên kỹ năng không vượt quá 100 ký tự")]
        public string Name { get; set; } = string.Empty;
    }
}
