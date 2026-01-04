using AutoMapper;
using Recruitment.API.Data;
using Recruitment.API.DTOs;
using Recruitment.API.Repositories.Interfaces;
using Recruitment.API.Services.Interfaces;

namespace Recruitment.API.Services
{
    public class SkillService : ISkillService
    {
        private readonly ISkillRepository _skillRepository;
        private readonly IMapper _mapper;
        private readonly AppDbContext _context;

        public SkillService(ISkillRepository skillRepository ,IMapper mapper, AppDbContext context)
        {
            _mapper = mapper;
            _context = context;
            _skillRepository = skillRepository;
        }
        public async Task<IEnumerable<SkillResponse>> GetAllSkillsAsync()
        {
            var skills = await _skillRepository.GetAllSkillsAsync();
            return _mapper.Map<IEnumerable<SkillResponse>>(skills);
        }
    }
}
