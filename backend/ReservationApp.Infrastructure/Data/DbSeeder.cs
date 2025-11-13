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

        // Seed regular user if it doesn't exist
        if (!await context.Users.AnyAsync(u => u.Email == "user@example.com"))
        {
            var userPasswordHash = BCrypt.Net.BCrypt.HashPassword("user123");
            var regularUser = new User("Regular User", "user@example.com", userPasswordHash, UserRole.User);
            await context.Users.AddAsync(regularUser);
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

        // Seed default SystemSettings with categories
        var settingsToSeed = new List<SystemSetting>();

        // General settings
        if (!await context.SystemSettings.AnyAsync(s => s.Category == "General" && s.Key == "CompanyName"))
        {
            settingsToSeed.Add(new SystemSetting("General", "CompanyName", "Toyota ISS", SettingType.String, "Company name"));
        }
        if (!await context.SystemSettings.AnyAsync(s => s.Category == "General" && s.Key == "Timezone"))
        {
            settingsToSeed.Add(new SystemSetting("General", "Timezone", "Europe/Istanbul", SettingType.String, "System timezone"));
        }

        // Reservation settings
        if (!await context.SystemSettings.AnyAsync(s => s.Category == "Reservation" && s.Key == "MaxWeeklyReservations"))
        {
            settingsToSeed.Add(new SystemSetting("Reservation", "MaxWeeklyReservations", "2", SettingType.Int, "Maximum number of reservations a user can make per week"));
        }
        if (!await context.SystemSettings.AnyAsync(s => s.Category == "Reservation" && s.Key == "AllowPastReservations"))
        {
            settingsToSeed.Add(new SystemSetting("Reservation", "AllowPastReservations", "false", SettingType.Bool, "Whether users can make reservations for past dates"));
        }
        if (!await context.SystemSettings.AnyAsync(s => s.Category == "Reservation" && s.Key == "CancellationNoticeHours"))
        {
            settingsToSeed.Add(new SystemSetting("Reservation", "CancellationNoticeHours", "2", SettingType.Int, "Hours before reservation that cancellation is allowed"));
        }
        if (!await context.SystemSettings.AnyAsync(s => s.Category == "Reservation" && s.Key == "AutoApproval"))
        {
            settingsToSeed.Add(new SystemSetting("Reservation", "AutoApproval", "false", SettingType.Bool, "Whether reservations are automatically approved"));
        }
        if (!await context.SystemSettings.AnyAsync(s => s.Category == "Reservation" && s.Key == "AllowSameDayReservations"))
        {
            settingsToSeed.Add(new SystemSetting("Reservation", "AllowSameDayReservations", "false", SettingType.Bool, "Whether users can make multiple reservations for the same day"));
        }

        // Notification settings
        if (!await context.SystemSettings.AnyAsync(s => s.Category == "Notifications" && s.Key == "EmailEnabled"))
        {
            settingsToSeed.Add(new SystemSetting("Notifications", "EmailEnabled", "true", SettingType.Bool, "Whether email notifications are enabled"));
        }
        if (!await context.SystemSettings.AnyAsync(s => s.Category == "Notifications" && s.Key == "DailyReminderEnabled"))
        {
            settingsToSeed.Add(new SystemSetting("Notifications", "DailyReminderEnabled", "true", SettingType.Bool, "Whether daily menu reminder emails are enabled"));
        }
        if (!await context.SystemSettings.AnyAsync(s => s.Category == "Notifications" && s.Key == "ReminderTime"))
        {
            settingsToSeed.Add(new SystemSetting("Notifications", "ReminderTime", "09:00", SettingType.String, "Time of day to send daily menu reminder emails (HH:mm format)"));
        }

        if (settingsToSeed.Any())
        {
            await context.SystemSettings.AddRangeAsync(settingsToSeed);
            await context.SaveChangesAsync();
        }
    }
}

