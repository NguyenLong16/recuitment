using Recruitment.API.DTOs;
using Recruitment.API.Models;

namespace Recruitment.API.Services.Interfaces
{
    public interface IProfileService
    {
        Task<UserProfileResponse> GetProfileAsync(int userId, int? currentViewerId = null);
        Task<UserProfileResponse> UpdateProfileUser(int id, ProfileUpdateRequest request);
        Task FollowHRAsync(int followerId, int employerId);
        Task UnfollowHRAsync(int followerId, int employerId);
        Task<string> UploadMediaAsync(IFormFile file, string folder, bool isImage);
        Task<IEnumerable<UserSummaryResponse>> GetFollowersAsync(int employerId);
    }
}
