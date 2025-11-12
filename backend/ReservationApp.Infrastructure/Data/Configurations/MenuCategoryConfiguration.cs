using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ReservationApp.Domain.Entities;

namespace ReservationApp.Infrastructure.Data.Configurations;

public class MenuCategoryConfiguration : IEntityTypeConfiguration<MenuCategory>
{
    public void Configure(EntityTypeBuilder<MenuCategory> builder)
    {
        builder.ToTable("MenuCategories");

        builder.HasKey(mc => mc.Id);

        builder.Property(mc => mc.Id)
            .IsRequired();

        builder.Property(mc => mc.Name)
            .IsRequired()
            .HasMaxLength(200);

        builder.HasIndex(mc => mc.Name)
            .IsUnique();

        builder.Property(mc => mc.CreatedAt)
            .IsRequired();

        builder.Property(mc => mc.UpdatedAt)
            .IsRequired(false);

        // Relationships
        builder.HasMany(mc => mc.Meals)
            .WithOne(m => m.Category)
            .HasForeignKey(m => m.CategoryId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

