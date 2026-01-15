using Recruitment.API.Models;

namespace Recruitment.API.Repositories.Interfaces
{
    public interface INotificationRepository
    {
        Task CreateNotificationAsync(int userId, string title, string content, int? applicationId = null);
        Task<Notification> CreateAsync(Notification notifications);
    }
}
