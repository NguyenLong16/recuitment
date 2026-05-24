using Recruitment.API.DTOs;
using Recruitment.API.Models;

namespace Recruitment.API.Repositories.Interfaces
{
    public interface ICategoryRepository
    {
        /// <summary>Lấy danh sách danh mục công việc (dành cho user/ứng viên).</summary>
        Task<IEnumerable<Category>> GetAllCategoriesAsync();

        // ── Admin ──
        /// <summary>[Admin] Lấy toàn bộ danh mục.</summary>
        Task<IEnumerable<Category>> GetAllAsync();

        /// <summary>[Admin] Lấy chi tiết danh mục theo ID.</summary>
        Task<Category?> GetByIdAsync(int id);

        /// <summary>[Admin] Tạo mới danh mục.</summary>
        Task<Category> CreateAsync(Category category);

        /// <summary>[Admin] Cập nhật danh mục.</summary>
        Task<Category> UpdateAsync(Category category);

        /// <summary>[Admin] Xóa danh mục theo ID.</summary>
        Task<bool> DeleteAsync(int id);
    }
}
