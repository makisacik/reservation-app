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

        // Note: Reservation seeding is commented out as it now requires Restaurant, Menu, and MealTimeSlot entities
        // This will be handled in Phase 2 with proper data seeding
        // Check if reservations already exist
        // if (await context.Reservations.AnyAsync())
        // {
        //     return; // Database already seeded
        // }
    }
}

