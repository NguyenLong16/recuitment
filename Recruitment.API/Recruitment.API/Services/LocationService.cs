using AutoMapper;
using Recruitment.API.Data;
using Recruitment.API.DTOs;
using Recruitment.API.Models;
using Recruitment.API.Repositories.Interfaces;
using Recruitment.API.Services.Interfaces;

namespace Recruitment.API.Services
{
    public class LocationService : ILocationService
    {
        private readonly ILocationRepository _locationRepository;
        private readonly IMapper _mapper;

        public LocationService(ILocationRepository locationRepository, IMapper mapper)
        {
            _locationRepository = locationRepository;
            _mapper = mapper;
        }

        public async Task<LocationResponse> CreateLocationAsync(LocationRequest request)
        {
            var location = _mapper.Map<Location>(request);
            var createdLocation = await _locationRepository.CreateAsync(location);
            return _mapper.Map<LocationResponse>(createdLocation);
        }

        public async Task DeleteLocationAsync(int id)
        {
            var result = await _locationRepository.DeleteAsync(id);
            if (!result)
            {
                throw new Exception("Không tìm thấy địa điểm để xóa");
            }
        }

        public async Task<IEnumerable<LocationResponse>> GetAllLocationAsync()
        {
            var locations = await _locationRepository.GetAllLocationAsync();
            return _mapper.Map<IEnumerable<LocationResponse>>(locations);
        }

        public async Task<IEnumerable<LocationResponse>> GetAllLocationsForAdminAsync()
        {
            var locations = await _locationRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<LocationResponse>>(locations);
        }

        public async Task<LocationResponse> GetLocationByIdAsync(int id)
        {
            var location = await _locationRepository.GetByIdAsync(id)
                ?? throw new Exception("Không tìm thấy địa điểm");
            return _mapper.Map<LocationResponse>(location);
        }

        public async Task<LocationResponse> UpdateLocationAsync(int id, LocationRequest request)
        {
            var existingLocation = await _locationRepository.GetByIdAsync(id)
                ?? throw new Exception("Không tìm thấy địa điểm để cập nhật");

            existingLocation.name = request.Name;

            var updatedLocation = await _locationRepository.UpdateAsync(existingLocation);
            return _mapper.Map<LocationResponse>(updatedLocation);
        }
    }
}
