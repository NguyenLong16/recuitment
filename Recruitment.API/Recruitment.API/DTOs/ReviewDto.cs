namespace Recruitment.API.DTOs
{
    public class ReviewResponse
    {
        public int Id { get; set; }
        public int Rating { get; set; }
        public string? Comment { get; set; }
        public DateTime CreatedDate { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string? UserAvatar { get; set; }
    }

    public class ReviewCreateRequest
    {
        public int Rating { get; set; } // 1-5 sao
        public string? Comment { get; set; }
    }


}
