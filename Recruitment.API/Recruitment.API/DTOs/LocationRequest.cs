using System.ComponentModel.DataAnnotations;

namespace Recruitment.API.DTOs
{
    public class LocationResponse
    {
        public int id { get; set; }
        public string name { get; set; }
    }

    public class LocationRequest
    {
        [Required(ErrorMessage = "Tên địa điểm không được để trống")]
        [MaxLength(100, ErrorMessage = "Tên địa điểm không vượt quá 100 ký tự")]
        public string Name { get; set; } = string.Empty;
    }
}
