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
        }
    }
}
