using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ReservationApp.Domain.Entities;
using ReservationApp.Domain.Enums;

namespace ReservationApp.Infrastructure.Data.Configurations;

public class MenuConfiguration : IEntityTypeConfiguration<Menu>
{
    public void Configure(EntityTypeBuilder<Menu> builder)
    {
        builder.ToTable("Menus");

        builder.HasKey(m => m.Id);

        builder.Property(m => m.Id)
            .IsRequired();

        builder.Property(m => m.RestaurantId)
            .IsRequired();

        builder.Property(m => m.Date)
            .IsRequired();

        builder.Property(m => m.MenuType)
            .IsRequired()
            .HasConversion(
                v => v.ToString(),
                v => (MenuType)Enum.Parse(typeof(MenuType), v))
            .HasMaxLength(50);

        builder.Property(m => m.CreatedAt)
            .IsRequired();

        builder.Property(m => m.UpdatedAt)
            .IsRequired(false);

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

