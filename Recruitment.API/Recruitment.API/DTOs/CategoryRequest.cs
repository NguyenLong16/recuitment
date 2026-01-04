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
}
