using ReservationApp.Application.Interfaces;
using ReservationApp.Application.Mappings;
using ReservationApp.Application.Services;

namespace ReservationApp.API.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddAutoMapper(typeof(MappingProfile));
        services.AddScoped<IReservationService, ReservationService>();
        services.AddScoped<IUserService, UserService>();
        
        return services;
    }
}

