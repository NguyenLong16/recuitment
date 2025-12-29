namespace Recruitment.API.Data
{
    public class Enums
    {
        public enum JobStatus
        {
            Open = 0,       // Đang tuyển
            Closed = 1,     // Đã đóng
            Draft = 2,      // Nháp
            Hidden = 3      //Tạm ẩn
        }

        public enum ApplicationStatus
        {
            Submitted = 0,  // Đã nộp
            Viewed = 1,     // Đã xem
            Interview = 2,  // Phỏng vấn
            Rejected = 3,   // Từ chối
            Accepted = 4    // Trúng tuyển
        }

        public enum JobType
        {
            OnSite = 0,
            Remote = 1,
            Hybrid = 2
        }
    }
}
