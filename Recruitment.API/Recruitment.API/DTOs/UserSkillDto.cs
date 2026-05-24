namespace Recruitment.API.DTOs
{
    /// <summary>Request khi ứng viên thêm kỹ năng vào hồ sơ</summary>
    public class UserSkillRequest
    {
        public int skillId { get; set; }
    }

    /// <summary>Response trả về thông tin một kỹ năng của ứng viên</summary>
    public class UserSkillResponse
    {
        public int skillId { get; set; }
        public string skillName { get; set; } = string.Empty;
    }

    /// <summary>Response gợi ý công việc phù hợp với kỹ năng ứng viên</summary>
    public class JobSuggestionResponse
    {
        public int id { get; set; }
        public string title { get; set; } = string.Empty;
        public string companyName { get; set; } = string.Empty;
        public string? companyLogoUrl { get; set; }
        public string locationName { get; set; } = string.Empty;
        public string jobType { get; set; } = string.Empty;
        public decimal? salaryMin { get; set; }
        public decimal? salaryMax { get; set; }
        public List<string> matchedSkills { get; set; } = new();
        public int matchScore { get; set; }   // % kỹ năng khớp so với tổng kỹ năng job yêu cầu
        public DateTime deadline { get; set; }
        public string? imageUrl { get; set; }
    }
}
