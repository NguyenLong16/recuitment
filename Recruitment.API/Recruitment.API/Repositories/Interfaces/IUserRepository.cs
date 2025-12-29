using Recruitment.API.Models;

namespace Recruitment.API.Repositories.Interfaces
{
    public interface IUserRepository
    {
        Task<User> GetByEmailAsync(string email);
        Task<bool> ExistsByEmailAsync(string email);
        Task CreateAsync(User user);
    }
}
