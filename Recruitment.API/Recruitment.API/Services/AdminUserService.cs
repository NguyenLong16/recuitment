using AutoMapper;
using Recruitment.API.DTOs;
using Recruitment.API.Repositories;
using Recruitment.API.Repositories.Interfaces;
using Recruitment.API.Services.Interfaces;

namespace Recruitment.API.Services
{
    public class AdminUserService : IAdminUserService
    {
        private readonly IAdminUserRepository _repository;
        private readonly IMapper _mapper;

        public AdminUserService(IAdminUserRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }
        public async Task<IEnumerable<AdminUserResponse>> GetUsersAsync(string? keyword, int? roleId)
        {
            var users = await _repository.GetAllUsersAsync(keyword, roleId);
            return _mapper.Map<IEnumerable<AdminUserResponse>>(users);
        }

        public async Task<bool> ToggleUserStatusAsync(int userId)
        {
            var result = await _repository.ToggleUserStatusAsync(userId);
            if (!result)
                throw new Exception("Không tìm thấy người dùng này trong hệ thống");

            return result;
        }
    }
}
