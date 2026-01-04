using AutoMapper;
using Recruitment.API.DTOs;
using Recruitment.API.Models;

namespace Recruitment.API.Mappings
{
    //Cấu hình chuyển đổi từ RegisterRequest sang User.
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<RegisterRequest, User>()
                .ForMember(dest => dest.passwordHash, opt => opt.Ignore());


            // Job -> JobResponse
            CreateMap<Job, JobResponse>()
                .ForMember(dest => dest.LocationName, opt => opt.MapFrom(src => src.location.name))
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.category.name))
                .ForMember(dest => dest.CompanyName, opt => opt.MapFrom(src => src.company.companyName))
                .ForMember(dest => dest.EmployerName, opt => opt.MapFrom(src => src.employer.fullName))
                .ForMember(dest => dest.JobType, opt => opt.MapFrom(src => src.jobType.ToString()))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.status.ToString()))
                .ForMember(dest => dest.SkillNames, opt => opt.MapFrom(src =>
                    src.jobSkills.Select(js => js.skill.skillName).ToList()))
                .ForMember(dest => dest.LocationId, opt => opt.MapFrom(src => src.locationId))  // Thêm ID
                .ForMember(dest => dest.CategoryId, opt => opt.MapFrom(src => src.categoryId))
                .ForMember(dest => dest.SkillIds, opt => opt.Ignore()) // Hoặc map từ JobSkills
                .ForMember(dest => dest.ImageFile, opt => opt.MapFrom(src => src.imageFile)); 

            // JobCreateRequest -> Job (if needed)
            CreateMap<JobCreateRequest, Job>()
                .ForMember(dest => dest.imageFile, opt => opt.MapFrom(src => src.ImageFile));

            CreateMap<JobUpdateRequest, Job>(MemberList.None)
                .ForMember(dest => dest.imageFile, opt => opt.MapFrom(src => src.ImageFile));

            CreateMap<Category, CategoryResponse>();

            CreateMap<Location, LocationResponse>();

            CreateMap<Skill, SkillResponse>();

        }
    }
}
