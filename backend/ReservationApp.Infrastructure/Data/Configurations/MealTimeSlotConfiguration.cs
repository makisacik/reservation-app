using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ReservationApp.Domain.Entities;

namespace ReservationApp.Infrastructure.Data.Configurations;

public class MealTimeSlotConfiguration : IEntityTypeConfiguration<MealTimeSlot>
{
    public void Configure(EntityTypeBuilder<MealTimeSlot> builder)
    {
        builder.ToTable("MealTimeSlots");

        builder.HasKey(mts => mts.Id);

        builder.Property(mts => mts.Id)
            .IsRequired()
            .ValueGeneratedOnAdd();

        builder.Property(mts => mts.Name)
            .IsRequired()
            .HasMaxLength(100);

        builder.HasIndex(mts => mts.Name)
            .IsUnique();

        builder.Property(mts => mts.StartTime)
            .IsRequired()
            .HasConversion(
                v => v.ToTimeSpan(),
                v => TimeOnly.FromTimeSpan(v));

        builder.Property(mts => mts.EndTime)
            .IsRequired()
            .HasConversion(
                v => v.ToTimeSpan(),
                v => TimeOnly.FromTimeSpan(v));

        builder.Property(mts => mts.CreatedAt)
            .IsRequired()
            .HasConversion(
                v => v,
                v => new DateTime(v.Ticks, DateTimeKind.Utc));

        builder.Property(mts => mts.UpdatedAt)
            .IsRequired(false)
            .HasConversion(
                v => v,
                v => v.HasValue ? new DateTime(v.Value.Ticks, DateTimeKind.Utc) : (DateTime?)null);
    }
}

