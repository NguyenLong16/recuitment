using Recruitment.API.Models;

namespace Recruitment.API.Repositories.Interfaces
{
    public interface INotificationRepository
    {
        /// <summary>Tạo thông báo mới cho user theo userId, tiêu đề, nội dung, loại thông báo và ID đối tượng liên quan (tuỳ chọn).</summary>
        Task CreateNotificationAsync(int userId, string title, string content, string type, int? referenceId = null);

        /// <summary>Lưu trực tiếp object Notification vào DB.</summary>
        Task<Notification> CreateAsync(Notification notifications);
    }
}
