using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Recruitment.API.Data;
using Recruitment.API.DTOs;
using Recruitment.API.Helpers;
using Recruitment.API.Models;
using Recruitment.API.Repositories.Interfaces;
using Recruitment.API.Services.Interfaces;

namespace Recruitment.API.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly JwtHelper _jwtHelper;
        private readonly IMapper _mapper;
        private readonly AppDbContext _context;

        public AuthService(IUserRepository userRepository, JwtHelper jwtHelper, IMapper mapper, AppDbContext context)
        {
            _userRepository = userRepository;
            _jwtHelper = jwtHelper;
            _mapper = mapper;
            _context = context;
        }

        public async Task<AuthResponse> LoginAsync(LoginRequest request)
        {
            // Tìm user
            var user = await _userRepository.GetByEmailAsync(request.email);
            if (user == null)
                throw new Exception("Tài khoản hoặc mật khẩu không đúng");

            // Verify mật khẩu
            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(request.password, user.passwordHash);
            if (!isPasswordValid)
                throw new Exception("Tài khoản hoặc mật khẩu không đúng");

            // Tài khoản bị khóa
            if (user.isActive)
                throw new Exception("Tài khoản của bạn đã bị khóa. Vui lòng liên hệ Admin để biết thêm chi tiết.");

            // Tạo access token
            string accessToken = _jwtHelper.GenerateToken(user);

            // Tạo refresh token và lưu DB
            string refreshToken = await CreateAndSaveRefreshTokenAsync(user.id);

            return new AuthResponse
            {
                accessToken = accessToken,
                refreshToken = refreshToken,
                fullName = user.fullName,
                role = user.role.roleName
            };
        }

        public async Task<string> RegisterAsync(RegisterRequest request)
        {
            // Kiểm tra email
            if (await _userRepository.ExistsByEmailAsync(request.email))
                throw new Exception("Email đã tồn tại");

            var user = _mapper.Map<User>(request);
            user.passwordHash = BCrypt.Net.BCrypt.HashPassword(request.password);
            string defaultAvatarUrl = $"https://ui-avatars.com/api/?name={Uri.EscapeDataString(request.fullName)}&background=random&color=fff&size=128";
            user.AvatarUrl = defaultAvatarUrl;
            await _userRepository.CreateAsync(user);
            return "Đăng ký thành công";
        }

        public async Task<AuthResponse> RefreshTokenAsync(string refreshToken)
        {
            // Tìm refresh token trong DB
            var tokenRecord = await _context.UserRefreshTokens
                .Include(t => t.user)
                .ThenInclude(u => u.role)
                .FirstOrDefaultAsync(t => t.token == refreshToken);

            if (tokenRecord == null)
                throw new Exception("Refresh token không hợp lệ");

            if (tokenRecord.isRevoked)
                throw new Exception("Refresh token đã bị thu hồi");

            if (tokenRecord.expiresAt < DateTime.UtcNow)
                throw new Exception("Refresh token đã hết hạn, vui lòng đăng nhập lại");

            var user = tokenRecord.user;

            if (!user.isActive)
                throw new Exception("Tài khoản đã bị khóa");

            // Thu hồi token cũ
            tokenRecord.isRevoked = true;
            _context.UserRefreshTokens.Update(tokenRecord);

            // Tạo access token mới
            string newAccessToken = _jwtHelper.GenerateToken(user);

            // Tạo refresh token mới (rotation)
            string newRefreshToken = await CreateAndSaveRefreshTokenAsync(user.id);

            await _context.SaveChangesAsync();

            return new AuthResponse
            {
                accessToken = newAccessToken,
                refreshToken = newRefreshToken,
                fullName = user.fullName,
                role = user.role.roleName
            };
        }

        public async Task LogoutAsync(string refreshToken)
        {
            var tokenRecord = await _context.UserRefreshTokens
                .FirstOrDefaultAsync(t => t.token == refreshToken);

            if (tokenRecord == null)
                throw new Exception("Refresh token không hợp lệ");

            // Đánh dấu token đã bị thu hồi
            tokenRecord.isRevoked = true;
            _context.UserRefreshTokens.Update(tokenRecord);
            await _context.SaveChangesAsync();
        }

        // ────────────────────────────────────────────────
        // Helper: tạo refresh token và lưu vào DB
        // ────────────────────────────────────────────────
        private async Task<string> CreateAndSaveRefreshTokenAsync(int userId)
        {
            string refreshToken = _jwtHelper.GenerateRefreshToken();

            var tokenRecord = new UserRefreshToken
            {
                token = refreshToken,
                userId = userId,
                expiresAt = DateTime.UtcNow.AddSeconds(45),    // Refresh token sống 7 ngày
                createdAt = DateTime.UtcNow,
                isRevoked = false
            };

            _context.UserRefreshTokens.Add(tokenRecord);
            await _context.SaveChangesAsync();

            return refreshToken;
        }
    }
}
