using Recruitment.API.Models;

namespace Recruitment.API.Repositories.Interfaces
{
    public interface INotificationRepository
    {
        Task CreateNotificationAsync(int userId, string title, string content, string type, int? referenceId = null);
        Task<Notification> CreateAsync(Notification notifications);
    }
}
