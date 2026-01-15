using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Recruitment.API.Data;
using System.Security.Claims;

namespace Recruitment.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationController : ControllerBase
    {
        private readonly AppDbContext _context;
        public NotificationController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetMyNotifications()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var notifications = await _context.Notifications 
                .Where(n => n.userId == userId)
                .OrderByDescending(n => n.createDate)
                .ToListAsync();
            return Ok(notifications);
        }

        [HttpGet("unread-count")]
        public async Task<IActionResult> GetUnreadCount()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
            var count = await _context.Notifications
                .Where(n => n.userId == userId && !n.isRead)
                .CountAsync();
            return Ok(new { count });
        }

        [HttpPatch("{id}/read")]
        public async Task<IActionResult> MarkAsRead(int id)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var notif = await _context.Notifications.FindAsync(id);

            if (notif == null || notif.userId != userId) return NotFound();
            notif.isRead = true;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNotification(int id)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
            var notif = await _context.Notifications.FindAsync(id);

            if (notif == null || notif.userId != userId) return NotFound();

            _context.Notifications.Remove(notif);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPatch("read-all")]
        public async Task<IActionResult> MarkAllAsRead()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);

            // Tìm tất cả thông báo chưa đọc của user này
            var unreadNotifications = await _context.Notifications
                .Where(n => n.userId == userId && !n.isRead)
                .ToListAsync();

            foreach (var notif in unreadNotifications)
            {
                notif.isRead = true;
            }

            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
