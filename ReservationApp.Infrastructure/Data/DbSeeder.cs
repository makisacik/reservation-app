using Microsoft.EntityFrameworkCore;
using ReservationApp.Domain.Entities;
using ReservationApp.Domain.Enums;

namespace ReservationApp.Infrastructure.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(ReservationDbContext context)
    {
        // Seed admin user if it doesn't exist
        if (!await context.Users.AnyAsync(u => u.Email == "admin@example.com"))
        {
            var adminPasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123");
            var adminUser = new User("Admin User", "admin@example.com", adminPasswordHash, UserRole.Admin);
            await context.Users.AddAsync(adminUser);
            await context.SaveChangesAsync();
        }

        // Seed default MealTimeSlots if they don't exist
        if (!await context.MealTimeSlots.AnyAsync())
        {
            var mealTimeSlots = new List<MealTimeSlot>
            {
                new MealTimeSlot("Breakfast", new TimeOnly(7, 0), new TimeOnly(10, 0)),
                new MealTimeSlot("Lunch", new TimeOnly(12, 0), new TimeOnly(14, 0)),
                new MealTimeSlot("Dinner", new TimeOnly(18, 0), new TimeOnly(21, 0))
            };

            await context.MealTimeSlots.AddRangeAsync(mealTimeSlots);
            await context.SaveChangesAsync();
        }

        // Seed default SystemSettings if they don't exist
        if (!await context.SystemSettings.AnyAsync())
        {
            var settings = new List<SystemSetting>
            {
                new SystemSetting("MaxWeeklyReservations", "2", SettingType.Int, "Maximum number of reservations a user can make per week"),
                new SystemSetting("AllowPastReservations", "false", SettingType.Bool, "Whether users can make reservations for past dates"),
                new SystemSetting("AllowSameDayReservations", "false", SettingType.Bool, "Whether users can make multiple reservations for the same day")
            };

            await context.SystemSettings.AddRangeAsync(settings);
            await context.SaveChangesAsync();
        }
    }
}

