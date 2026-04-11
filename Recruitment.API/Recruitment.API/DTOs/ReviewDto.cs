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

    public class ReviewSummaryResponse
    {
        public double AverageRating { get; set; } // Điểm trung bình (vd: 4.5)
        public int TotalReviews { get; set; }     // Tổng số đánh giá

        // Thống kê chi tiết: Key là số sao (1-5), Value là số lượng
        // Ví dụ: { 5: 10, 4: 2, 3: 0, ... }
        public Dictionary<int, int> StarCounts { get; set; }

        // Danh sách review (đã lọc)
        public IEnumerable<ReviewResponse> Reviews { get; set; }
    }
    //admin
    public class AdminReviewResponse
    {
        public int Id { get; set; }
        public int Rating { get; set; }
        public string? Comment { get; set; }
        public DateTime CreatedDate { get; set; }

        // Thông tin người đánh giá
        public string ReviewerName { get; set; } = string.Empty;

        // Thông tin bài bị đánh giá
        public string JobTitle { get; set; } = string.Empty;
        public string CompanyName { get; set; } = string.Empty;
    }

}
