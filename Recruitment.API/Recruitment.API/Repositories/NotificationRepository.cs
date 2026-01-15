using Recruitment.API.Data;
using Recruitment.API.Models;
using Recruitment.API.Repositories.Interfaces;

namespace Recruitment.API.Repositories
{
    public class NotificationRepository : INotificationRepository
    {
        private readonly AppDbContext _context;
        public NotificationRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task CreateNotificationAsync(int userId, string title, string content, int? applicationId = null)
        {
            var notifications = new Notification
            {
                userId = userId,
                title = title,
                content = content,
                isRead = false,
                createDate = DateTime.Now,
                applicationId = applicationId
            };

            _context.Notifications.Add(notifications);
            await _context.SaveChangesAsync();
        }

        public async Task<Notification> CreateAsync(Notification notifications)
        {
            _context.Notifications.Add(notifications);
            await _context.SaveChangesAsync();
            return notifications;
        }
    }
}
