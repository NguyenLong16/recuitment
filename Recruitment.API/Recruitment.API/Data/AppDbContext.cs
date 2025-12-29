using Microsoft.EntityFrameworkCore;
using Recruitment.API.Models;

namespace Recruitment.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions options) : base(options) { }
        public DbSet<Role> Roles { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Company> Companies { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Job> Jobs { get; set; }
        public DbSet<Skill> Skills { get; set; }
        public DbSet<JobSkill> JobSkills { get; set; }
        public DbSet<Education> Educations { get; set; }
        public DbSet<Experience> Experiences { get; set; }
        public DbSet<Application> Applications { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // 1. Cấu hình Key cho bảng trung gian JobSkill (Composite Key)
            modelBuilder.Entity<JobSkill>()
                .HasKey(js => new { js.jobId, js.skillId });

            modelBuilder.Entity<JobSkill>()
                .HasOne(js => js.job)
                .WithMany(j => j.jobSkills)
                .HasForeignKey(js => js.jobId);

            modelBuilder.Entity<JobSkill>()
                .HasOne(js => js.skill)
                .WithMany(s => s.jobSkills)
                .HasForeignKey(js => js.skillId);

            // 2. Cấu hình quan hệ User - Job (Người tuyển dụng đăng bài)
            // Khi xóa User -> Không được xóa Job (để lưu dữ liệu) hoặc set null tùy logic
            modelBuilder.Entity<Job>()
                .HasOne(j => j.employer)
                .WithMany(u => u.postedJobs)
                .HasForeignKey(j => j.employerId)
                .OnDelete(DeleteBehavior.Restrict);
            // Restrict: Chặn xóa User nếu User đó đã đăng bài (An toàn nhất cho hệ thống tuyển dụng)

            // 3. Cấu hình Application (Hồ sơ ứng tuyển)
            // - Xóa Job -> Xóa luôn Application liên quan? -> OK
            // - Xóa User (Candidate) -> Xóa luôn Application của họ? -> OK
            // Nhưng để tránh lỗi "Multiple Cascade Paths" trong SQL Server, ta nên để 1 cái là Restrict

            modelBuilder.Entity<Application>()
                .HasOne(a => a.job)
                .WithMany(j => j.applications)
                .HasForeignKey(a => a.jobId)
                .OnDelete(DeleteBehavior.Restrict); // Nếu Job bị xóa, cần xử lý bằng tay hoặc giữ lại Application history

            modelBuilder.Entity<Application>()
                .HasOne(a => a.candidate)
                .WithMany(u => u.applications)
                .HasForeignKey(a => a.candidateId)
                .OnDelete(DeleteBehavior.Cascade); // Xóa ứng viên thì xóa luôn hồ sơ ứng tuyển của họ
        }
    }
}
