using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using ReservationApp.Application.Interfaces;
using ReservationApp.Infrastructure.Data;
using ReservationApp.Infrastructure.Repositories;

namespace ReservationApp.Infrastructure.Extensions;

public static class InfrastructureServiceRegistration
{
    public static IServiceCollection AddInfrastructureServices(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");

        services.AddDbContext<ReservationDbContext>(options =>
            options.UseNpgsql(connectionString));

        services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
        services.AddScoped<IReservationRepository, ReservationRepository>();
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IRestaurantRepository, RestaurantRepository>();
        services.AddScoped<IMenuRepository, MenuRepository>();
        services.AddScoped<IMealRepository, MealRepository>();
        services.AddScoped<IMealTimeSlotRepository, MealTimeSlotRepository>();
        services.AddScoped<ISettingRepository, SettingRepository>();
        services.AddScoped<IReportRepository, ReportRepository>();

        return services;
    }
}

