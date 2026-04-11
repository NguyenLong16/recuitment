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

    public class AdminCompanyResponse
    {
        public int Id { get; set; }
        public string CompanyName { get; set; } = string.Empty;
        public string? LogoUrl { get; set; }
        public string? WebsiteLink { get; set; }
        public string? Address { get; set; }
        public int Size { get; set; }

        // Cột đặc biệt dành cho Admin: Đếm tổng số Job của công ty này
        public int TotalJobs { get; set; }
    }
}
