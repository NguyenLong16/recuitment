using AutoMapper;
using Recruitment.API.DTOs;
using Recruitment.API.Repositories.Interfaces;

namespace Recruitment.API.Services
{
    public class AdminCompanyService : IAdminCompanyService
    {
        private readonly IAdminCompanyRepository _adminCompanyRepository;
        private readonly IMapper _mapper;

        public AdminCompanyService(IAdminCompanyRepository adminCompanyRepository, IMapper mapper)
        {
            _adminCompanyRepository = adminCompanyRepository;
            _mapper = mapper;
        }
        public async Task<IEnumerable<AdminCompanyResponse>> GetCompaniesAsync(string? keyword)
        {
            var companies = await _adminCompanyRepository.GetAllCompaniesAsync(keyword);
            return _mapper.Map<IEnumerable<AdminCompanyResponse>>(companies);
        }
    }
}
