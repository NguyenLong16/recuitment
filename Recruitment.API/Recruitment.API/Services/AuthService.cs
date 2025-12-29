using AutoMapper;
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

        public AuthService(IUserRepository userRepository, JwtHelper jwtHelper, IMapper mapper)
        {
            _userRepository = userRepository;
            _jwtHelper = jwtHelper;
            _mapper = mapper;
        }

        public async Task<AuthResponse> LoginAsync(LoginRequest request)
        {
            //Tìm user
            var user = await _userRepository.GetByEmailAsync(request.email);
            if(user == null )
            {
                throw new Exception("Tài khoản hoặc mật khẩu không đúng");
            }

            //Verify mật khẩu
            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(request.password, user.passwordHash);
            if(!isPasswordValid)
            {
                throw new Exception("Tài khoản hoặc mật khẩu không đúng");
            }

            //Tạo token
            string token = _jwtHelper.GenerateToken(user);

            return new AuthResponse
            {
                token = token,
                fullName = user.fullName,
                role = user.role.roleName
            };
        }

        public async Task<string> RegisterAsync(RegisterRequest request)
        {
            //kiểm tra email 
            if(await _userRepository.ExistsByEmailAsync(request.email))
            {
                throw new Exception("Email đã tồn tại");
            }

            var user = _mapper.Map<User>(request);

            user.passwordHash = BCrypt.Net.BCrypt.HashPassword(request.password);
            string defaultAvatarUrl = $"https://ui-avatars.com/api/?name={Uri.EscapeDataString(request.fullName)}&background=random&color=fff&size=128";
            user.AvatarUrl = defaultAvatarUrl;
            await _userRepository.CreateAsync(user);
            return "Đăng ký thành công";
        }
    }
}
