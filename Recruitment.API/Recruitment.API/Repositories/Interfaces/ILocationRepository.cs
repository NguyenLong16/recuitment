using Recruitment.API.Models;

namespace Recruitment.API.Repositories.Interfaces
{
    public interface ILocationRepository
    {
        /// <summary>Lấy danh sách địa điểm/tỉnh thành (dành cho user).</summary>
        Task<IEnumerable<Location>> GetAllLocationAsync();

        // ── Admin ──
        /// <summary>[Admin] Lấy toàn bộ địa điểm.</summary>
        Task<IEnumerable<Location>> GetAllAsync();

        /// <summary>[Admin] Lấy chi tiết địa điểm theo ID.</summary>
        Task<Location?> GetByIdAsync(int id);

        /// <summary>[Admin] Tạo mới địa điểm.</summary>
        Task<Location> CreateAsync(Location location);

        /// <summary>[Admin] Cập nhật địa điểm.</summary>
        Task<Location> UpdateAsync(Location location);

        /// <summary>[Admin] Xóa địa điểm theo ID.</summary>
        Task<bool> DeleteAsync(int id);
    }
}
