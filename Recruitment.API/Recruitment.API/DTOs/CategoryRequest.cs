using Recruitment.API.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Recruitment.API.DTOs
{
    public class CategoryResponse
    {
        public int id { get; set; }
        public string name { get; set; }
        //Một danh mục có nhiều job
    }

    public class CategoryRequest
    {
        [Required(ErrorMessage = "Tên danh mục không được để trống")]
        [MaxLength(100, ErrorMessage = "Tên danh mục không vượt quá 100 ký tự")]
        public string Name { get; set; } = string.Empty;
    }
}
