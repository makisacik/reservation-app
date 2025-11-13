using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ReservationApp.Domain.Entities;

namespace ReservationApp.Infrastructure.Data.Configurations;

public class MealConfiguration : IEntityTypeConfiguration<Meal>
{
    public void Configure(EntityTypeBuilder<Meal> builder)
    {
        builder.ToTable("Meals");

        builder.HasKey(m => m.Id);

        builder.Property(m => m.Id)
            .IsRequired();

        builder.Property(m => m.Name)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(m => m.Description)
            .HasMaxLength(1000);

        builder.Property(m => m.Kcal)
            .IsRequired(false);

        builder.Property(m => m.CategoryId)
            .IsRequired();

        builder.Property(m => m.RestaurantId)
            .IsRequired();

        builder.Property(m => m.ImageUrl)
            .HasMaxLength(500);

        builder.Property(m => m.CreatedAt)
            .IsRequired()
            .HasConversion(
                v => v,
                v => new DateTime(v.Ticks, DateTimeKind.Utc));

        builder.Property(m => m.UpdatedAt)
            .IsRequired(false)
            .HasConversion(
                v => v,
                v => v.HasValue ? new DateTime(v.Value.Ticks, DateTimeKind.Utc) : (DateTime?)null);

        // Indexes
        builder.HasIndex(m => m.RestaurantId);
        builder.HasIndex(m => m.CategoryId);
        builder.HasIndex(m => new { m.RestaurantId, m.Name });

        // Relationships
        builder.HasOne(m => m.Category)
            .WithMany(mc => mc.Meals)
            .HasForeignKey(m => m.CategoryId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(m => m.Restaurant)
            .WithMany(r => r.Meals)
            .HasForeignKey(m => m.RestaurantId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

