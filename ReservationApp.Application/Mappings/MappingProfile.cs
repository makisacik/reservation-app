using AutoMapper;
using ReservationApp.Application.DTOs;
using ReservationApp.Domain.Entities;

namespace ReservationApp.Application.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // Reservation mappings
        CreateMap<Reservation, ReservationDto>()
            .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.User.Name))
            .ForMember(dest => dest.RestaurantName, opt => opt.MapFrom(src => src.Restaurant.Name))
            .ForMember(dest => dest.MenuDate, opt => opt.MapFrom(src => src.Menu.Date))
            .ForMember(dest => dest.MealTimeSlotName, opt => opt.MapFrom(src => src.MealTimeSlot.Name));
        
        CreateMap<CreateReservationDto, Reservation>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore());
        
        // User mappings
        CreateMap<Domain.Entities.User, UserDto>();
        
        // Restaurant mappings
        CreateMap<Restaurant, RestaurantDto>();
        
        // Menu mappings
        CreateMap<Menu, MenuDto>()
            .ForMember(dest => dest.RestaurantName, opt => opt.MapFrom(src => src.Restaurant.Name))
            .ForMember(dest => dest.Meals, opt => opt.MapFrom(src => src.Meals));
        
        // Meal mappings
        CreateMap<Meal, MealDto>()
            .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category.Name))
            .ForMember(dest => dest.RestaurantName, opt => opt.MapFrom(src => src.Restaurant.Name));
        
        // MealTimeSlot mappings
        CreateMap<MealTimeSlot, MealTimeSlotDto>();
    }
}

