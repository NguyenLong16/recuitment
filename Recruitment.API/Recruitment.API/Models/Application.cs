using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using static Recruitment.API.Data.Enums;

namespace Recruitment.API.Models
{
    public class Application
    {
        [Key] 
        public int id { get; set; }
        public int jobId { get; set; } // Ứng tuyển vào Job nào

        [ForeignKey("jobId")]
        public virtual Job job { get; set; } // Truy cập ngược lại thông tin job
        public int candidateId { get; set; } // Ai là người ứng tuyển
        [ForeignKey("candidateId")]
        public virtual User candidate { get; set; }
        public string cvUrl { get; set; } //link file CV
        public string coverLetter { get; set; } //Thư giới thiệu (Optional)
        public DateTime appliedDate { get; set; } = DateTime.Now;
        public ApplicationStatus status { get; set; } = ApplicationStatus.Submitted; // Mặc định là "Đã nộp"
        // --- Foreign Keys ---

    }
}
