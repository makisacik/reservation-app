using AutoMapper;
using ReservationApp.Application.DTOs;
using ReservationApp.Domain.Entities;

namespace ReservationApp.Application.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Reservation, ReservationDto>();
        CreateMap<CreateReservationDto, Reservation>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore());
    }
}

