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
            var adminUser = new User("admin@example.com", adminPasswordHash, UserRole.Admin);
            await context.Users.AddAsync(adminUser);
            await context.SaveChangesAsync();
        }

        // Check if reservations already exist
        if (await context.Reservations.AnyAsync())
        {
            return; // Database already seeded
        }

        var tomorrow = DateTime.UtcNow.AddDays(1).Date;
        var nextWeek = DateTime.UtcNow.AddDays(7).Date;
        var nextMonth = DateTime.UtcNow.AddDays(30).Date;

        var reservations = new List<Reservation>
        {
            new Reservation("John Doe", tomorrow.AddHours(18), 4),
            new Reservation("Jane Smith", tomorrow.AddHours(19).AddMinutes(30), 2),
            new Reservation("Bob Johnson", nextWeek.AddHours(17), 6),
            new Reservation("Alice Williams", nextWeek.AddHours(20), 3),
            new Reservation("Charlie Brown", nextMonth.AddHours(19), 8),
            new Reservation("Diana Prince", tomorrow.AddHours(20), 2),
            new Reservation("Ethan Hunt", nextWeek.AddHours(18).AddMinutes(30), 4),
            new Reservation("Fiona Apple", nextMonth.AddHours(18), 5)
        };

        await context.Reservations.AddRangeAsync(reservations);
        await context.SaveChangesAsync();
    }
}

