using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ReservationApp.Domain.Entities;
using ReservationApp.Domain.Enums;

namespace ReservationApp.Infrastructure.Data.Configurations;

public class MenuConfiguration : IEntityTypeConfiguration<Menu>
{
    private static DateTime ConvertToUtcDateTime(DateTime dateTime)
    {
        if (dateTime.Kind == DateTimeKind.Utc)
        {
            return dateTime;
        }
        
        if (dateTime.Kind == DateTimeKind.Unspecified)
        {
            // Treat Unspecified as UTC (for date-only values)
            return new DateTime(dateTime.Year, dateTime.Month, dateTime.Day, dateTime.Hour, dateTime.Minute, dateTime.Second, DateTimeKind.Utc);
        }
        
        // Local time, convert to UTC
        return dateTime.ToUniversalTime();
    }

    public void Configure(EntityTypeBuilder<Menu> builder)
    {
        builder.ToTable("Menus");

        builder.HasKey(m => m.Id);

        builder.Property(m => m.Id)
            .IsRequired();

        builder.Property(m => m.RestaurantId)
            .IsRequired();

        builder.Property(m => m.Date)
            .IsRequired()
            .HasConversion(
                v => ConvertToUtcDateTime(v),
                v => new DateTime(v.Ticks, DateTimeKind.Utc));

        builder.Property(m => m.MenuType)
            .IsRequired()
            .HasConversion(
                v => v.ToString(),
                v => (MenuType)Enum.Parse(typeof(MenuType), v))
            .HasMaxLength(50);

        builder.Property(m => m.CreatedAt)
            .IsRequired()
            .HasConversion(
                v => ConvertToUtcDateTime(v),
                v => new DateTime(v.Ticks, DateTimeKind.Utc));

        builder.Property(m => m.UpdatedAt)
            .IsRequired(false)
            .HasConversion(
                v => v.HasValue ? ConvertToUtcDateTime(v.Value) : (DateTime?)null,
                v => v.HasValue ? new DateTime(v.Value.Ticks, DateTimeKind.Utc) : (DateTime?)null);

        // Indexes
        builder.HasIndex(m => m.RestaurantId);
        builder.HasIndex(m => m.Date);
        builder.HasIndex(m => new { m.RestaurantId, m.Date });

        // Relationships
        builder.HasOne(m => m.Restaurant)
            .WithMany(r => r.Menus)
            .HasForeignKey(m => m.RestaurantId)
            .OnDelete(DeleteBehavior.Cascade);

        // Many-to-many relationship with Meal (implicit, no join entity)
        builder.HasMany(m => m.Meals)
            .WithMany(meal => meal.Menus);
    }
}

