using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ReservationApp.Domain.Entities;
using ReservationApp.Domain.Enums;

namespace ReservationApp.Infrastructure.Data.Configurations;

public class ReservationConfiguration : IEntityTypeConfiguration<Reservation>
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
    public void Configure(EntityTypeBuilder<Reservation> builder)
    {
        builder.ToTable("Reservations");

        builder.HasKey(r => r.Id);

        builder.Property(r => r.Id)
            .IsRequired();

        builder.Property(r => r.UserId)
            .IsRequired();

        builder.Property(r => r.RestaurantId)
            .IsRequired();

        builder.Property(r => r.MenuId)
            .IsRequired();

        builder.Property(r => r.MealTimeSlotId)
            .IsRequired();

        builder.Property(r => r.Date)
            .IsRequired()
            .HasConversion(
                // Convert to UTC when writing to database
                v => ConvertToUtcDateTime(v),
                // Read as UTC from database
                v => new DateTime(v.Ticks, DateTimeKind.Utc));

        builder.Property(r => r.Appetizer)
            .IsRequired()
            .HasDefaultValue(false);

        builder.Property(r => r.Status)
            .IsRequired()
            .HasConversion(
                v => v.ToString(),
                v => (ReservationStatus)Enum.Parse(typeof(ReservationStatus), v))
            .HasMaxLength(50)
            .HasDefaultValue(ReservationStatus.Active);

        builder.Property(r => r.CreatedAt)
            .IsRequired()
            .HasConversion(
                v => ConvertToUtcDateTime(v),
                v => new DateTime(v.Ticks, DateTimeKind.Utc));

        builder.Property(r => r.UpdatedAt)
            .IsRequired(false)
            .HasConversion(
                v => v.HasValue ? ConvertToUtcDateTime(v.Value) : (DateTime?)null,
                v => v.HasValue ? new DateTime(v.Value.Ticks, DateTimeKind.Utc) : (DateTime?)null);

        // Indexes
        builder.HasIndex(r => r.UserId);
        builder.HasIndex(r => r.RestaurantId);
        builder.HasIndex(r => r.MenuId);
        builder.HasIndex(r => r.Date);
        builder.HasIndex(r => r.Status);
        builder.HasIndex(r => new { r.UserId, r.Date });

        // Relationships
        builder.HasOne(r => r.User)
            .WithMany()
            .HasForeignKey(r => r.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(r => r.Restaurant)
            .WithMany()
            .HasForeignKey(r => r.RestaurantId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(r => r.Menu)
            .WithMany()
            .HasForeignKey(r => r.MenuId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(r => r.MealTimeSlot)
            .WithMany()
            .HasForeignKey(r => r.MealTimeSlotId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

