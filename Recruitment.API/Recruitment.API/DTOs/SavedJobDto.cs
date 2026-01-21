namespace Recruitment.API.DTOs
{
    public class SavedJobResponse
    {
        public int JobId { get; set; }
        public string JobTitle { get; set; } = string.Empty;
        public string CompanyName { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public DateTime SavedDate { get; set; }
    }
}
