using AutoMapper;
using Recruitment.API.Data;
using Recruitment.API.DTOs;
using Recruitment.API.Repositories.Interfaces;
using Recruitment.API.Services.Interfaces;

namespace Recruitment.API.Services
{
    public class LocationService : ILocationService
    {
        private readonly ILocationRepository _locationRepository;
        private readonly IMapper _mapper;
        private readonly AppDbContext _context;

        public LocationService(ILocationRepository locationRepository, IMapper mapper, AppDbContext context)
        {
            _locationRepository = locationRepository;
            _mapper = mapper;
            _context = context;
        }

        public async Task<IEnumerable<LocationResponse>> GetAllLocationAsync()
        {
            var locations = await _locationRepository.GetAllLocationAsync();
            return _mapper.Map<IEnumerable<LocationResponse>>(locations);
        }
    }
}
