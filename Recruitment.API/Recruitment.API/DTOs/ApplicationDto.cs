using System.ComponentModel.DataAnnotations;
using static Recruitment.API.Data.Enums;

namespace Recruitment.API.DTOs
{
    public class ApplyJobRequest
    {
        [Required]
        public int jobId { get; set; }
        public string? coverLetter { get; set; }
        [Required]
        public IFormFile cvFile { get; set; }
    }

    public class ApplicationResponse
    {
        public int id { get; set; }
        public int jobId { get; set; }
        public string jobTitle { get; set; } = string.Empty;
        public string candidateName { get; set; } = string.Empty;
        public string cvUrl { get; set; } = string.Empty;
        public string? coverLetter { get; set; }
        public DateTime appliedDate { get; set; }
        public string status { get; set; } = string.Empty;
    }

    public class UpdateStatusRequest
    {
        public ApplicationStatus Status { get; set; }
    }

    public class ApplicationStatsResponse
    {
        public string Label { get; set; } // Nhãn hiển thị (VD: "Tháng 1/2026", "Tuần 42")
        public int Total { get; set; }    // Tổng số hồ sơ
        public int Submitted { get; set; } // Số lượng Đã nộp
        public int Interview { get; set; } // Số lượng Phỏng vấn
        public int Hired { get; set; }     // Số lượng Trúng tuyển
        public int Rejected { get; set; }  // Số lượng Từ chối
    }
}
