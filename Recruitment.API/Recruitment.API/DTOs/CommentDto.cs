namespace Recruitment.API.DTOs
{
    public class CommentResponse
    {
        public int Id { get; set; }
        public string Content { get; set; } = string.Empty;
        public DateTime CreatedDate { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string? UserAvatar { get; set; }
        public int UserId { get; set; }
        public int? ParentId { get; set; }
        // Danh sách các câu trả lời con
        public List<CommentResponse> Replies { get; set; } = new List<CommentResponse>();
    }

    public class CommentCreateRequest
    {
        public string Content { get; set; } = string.Empty;
        public int? ParentId { get; set; } // Nếu trả lời thì gửi ID cha lên
    }
}
