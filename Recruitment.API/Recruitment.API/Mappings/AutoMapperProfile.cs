// Recruitment.API.Mappings/AutoMapperProfile.cs

using AutoMapper;
using Recruitment.API.DTOs;
using Recruitment.API.Models;

public class AutoMapperProfile : Profile
{
    public AutoMapperProfile()
    {
        CreateMap<RegisterRequest, User>()
            .ForMember(dest => dest.passwordHash, opt => opt.Ignore());

        // GỘP TẤT CẢ VÀO ĐÂY
        CreateMap<Job, JobResponse>()
            .ForMember(dest => dest.LocationName, opt => opt.MapFrom(src => src.location.name))
            .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.category.name))
            .ForMember(dest => dest.CompanyName, opt => opt.MapFrom(src => src.company.companyName))
            .ForMember(dest => dest.EmployerName, opt => opt.MapFrom(src => src.employer.fullName))
            .ForMember(dest => dest.JobType, opt => opt.MapFrom(src => src.jobType.ToString()))
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.status.ToString()))
            .ForMember(dest => dest.SkillNames, opt => opt.MapFrom(src =>
                src.jobSkills.Select(js => js.skill.skillName).ToList()))
            .ForMember(dest => dest.LocationId, opt => opt.MapFrom(src => src.locationId))
            .ForMember(dest => dest.CategoryId, opt => opt.MapFrom(src => src.categoryId))
            // SỬA: Lấy danh sách ID kỹ năng thay vì Ignore
            .ForMember(dest => dest.SkillIds, opt => opt.MapFrom(src =>
                src.jobSkills.Select(js => js.skillId).ToList()))
            // THÊM: ImageUrl vào cùng 1 block
            .ForMember(dest => dest.ImageUrl, opt => opt.MapFrom(src => src.imageUrl));

        // Các mapping khác giữ nguyên nhưng bỏ các block trùng lặp
        CreateMap<JobCreateRequest, Job>()
            .ForMember(dest => dest.imageUrl, opt => opt.Ignore());

        CreateMap<JobUpdateRequest, Job>(MemberList.None)
            .ForMember(dest => dest.imageUrl, opt => opt.Ignore());

        CreateMap<Category, CategoryResponse>();
        CreateMap<Location, LocationResponse>();
        CreateMap<Skill, SkillResponse>();

        CreateMap<Application, ApplicationResponse>()
            .ForMember(dest => dest.jobTitle, opt => opt.MapFrom(src => src.job.title))
            .ForMember(dest => dest.candidateName, opt => opt.MapFrom(src => src.candidate.fullName))
            .ForMember(dest => dest.status, opt => opt.MapFrom(src => src.status.ToString()));

        CreateMap<User, UserProfileResponse>()
            .ForMember(dest => dest.roleName, opt => opt.MapFrom(src => src.role.roleName))
            .ForMember(dest => dest.FollowerCount, opt => opt.MapFrom(src => src.followers.Count))
            // Sửa lỗi lệch tên và Casing
            .ForMember(dest => dest.professionalTitle, opt => opt.MapFrom(src => src.professionalTitle))
            .ForMember(dest => dest.DefaultCvUrl, opt => opt.MapFrom(src => src.defaultCvUrl))
            .ForMember(dest => dest.WebsiteUrl, opt => opt.MapFrom(src => src.websiteUrl))
            .ForMember(dest => dest.LinkedInUrl, opt => opt.MapFrom(src => src.linkedInUrl))
            .ForMember(dest => dest.GitHubUrl, opt => opt.MapFrom(src => src.githubUrl));

        CreateMap<ProfileUpdateRequest, User>()
            .ForMember(dest => dest.AvatarUrl, opt => opt.Ignore())
            .ForMember(dest => dest.coverImageUrl, opt => opt.Ignore())
            .ForMember(dest => dest.defaultCvUrl, opt => opt.Ignore())
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

        CreateMap<Education, EducationDto>();
        CreateMap<Experience, ExperienceDTO>();
        CreateMap<Company, CompanyResponse>();

        CreateMap<Comment, CommentResponse>()
            .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.user.fullName))
            .ForMember(dest => dest.UserAvatar, opt => opt.MapFrom(src => src.user.AvatarUrl));

        CreateMap<Review, ReviewResponse>()
            .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.user.fullName))
            .ForMember(dest => dest.UserAvatar, opt => opt.MapFrom(src => src.user.AvatarUrl));

        CreateMap<SavedJob, SavedJobResponse>()
            .ForMember(dest => dest.JobTitle, opt => opt.MapFrom(src => src.job.title))
            .ForMember(dest => dest.CompanyName, opt => opt.MapFrom(src => src.job.company.companyName))
            .ForMember(dest => dest.ImageUrl, opt => opt.MapFrom(src => src.job.imageUrl));
    }
}