using Recruitment.API.DTOs;

namespace Recruitment.API.Services.Interfaces
{
    public interface IAuthService
    {
        Task<string> RegisterAsync(RegisterRequest request);
        Task<AuthResponse> LoginAsync(LoginRequest request);
    }
}
