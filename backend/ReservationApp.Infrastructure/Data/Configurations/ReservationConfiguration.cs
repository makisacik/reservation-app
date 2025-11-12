using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ReservationApp.Domain.Entities;
using ReservationApp.Domain.Enums;

namespace ReservationApp.Infrastructure.Data.Configurations;

public class ReservationConfiguration : IEntityTypeConfiguration<Reservation>
{
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
            .IsRequired();

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
            .IsRequired();

        builder.Property(r => r.UpdatedAt)
            .IsRequired(false);

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

