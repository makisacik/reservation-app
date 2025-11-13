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
        services.AddScoped<IRestaurantService, RestaurantService>();
        services.AddScoped<IMenuService, MenuService>();
        services.AddScoped<IMealService, MealService>();
        services.AddScoped<IMealTimeSlotService, MealTimeSlotService>();
        services.AddScoped<ISettingService, SettingService>();
        services.AddScoped<ITimezoneService, TimezoneService>();
        services.AddScoped<IReportService, ReportService>();
        services.AddScoped<IEmailNotificationService, EmailNotificationService>();
        services.AddHostedService<EmailNotificationWorker>();
        
        return services;
    }
}

