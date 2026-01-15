using Recruitment.API.Models;
using System.ComponentModel.DataAnnotations;

namespace Recruitment.API.DTOs
{
    public class CompanyResponse
    {
        public int id { get; set; }
        public string companyName { get; set; }
        public string? logoUrl { get; set; }
        public string? description { get; set; }
        public string? websiteLink { get; set; }
        public string? address { get; set; }
        public int size { get; set; } 
    }
}
