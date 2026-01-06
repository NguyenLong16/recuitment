namespace Recruitment.API.Data
{
    public class Enums
    {
        public enum JobStatus
        {
            Draft = 0,    // Ẩn (chưa đăng)
            Active = 1,   // Hiện (hiển thị)
            Closed = 2,   // Ẩn (đóng thủ công)
            Expired = 3   // Tự động ẩn khi hết hạn
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
            Draft = 0,  // Nếu cần
            FullTime = 1,
            PartTime = 2,
            Internship = 3,
            Contract = 4,  // Nếu có Contract, giữ 4
            Remote = 5
        }
    }
}
