using AutoMapper;
using Recruitment.API.DTOs;
using Recruitment.API.Models;
using Recruitment.API.Repositories.Interfaces;

namespace Recruitment.API.Services.Interfaces
{
    public interface IReviewService
    {
        Task<ReviewResponse> PostReviewAsync(int userId, int jobId, ReviewCreateRequest request);
    }
}
