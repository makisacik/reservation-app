using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ReservationApp.Domain.Entities;
using ReservationApp.Domain.Enums;

namespace ReservationApp.Infrastructure.Data.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("Users");

        builder.HasKey(u => u.Id);

        builder.Property(u => u.Id)
            .IsRequired();

        builder.Property(u => u.Name)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(u => u.Email)
            .IsRequired()
            .HasMaxLength(200);

        builder.HasIndex(u => u.Email)
            .IsUnique();

        builder.Property(u => u.PasswordHash)
            .IsRequired()
            .HasMaxLength(500);

        builder.Property(u => u.Department)
            .HasMaxLength(200);

        builder.Property(u => u.Role)
            .IsRequired()
            .HasConversion(
                v => v.ToString(),
                v => (UserRole)Enum.Parse(typeof(UserRole), v))
            .HasMaxLength(50);

        builder.Property(u => u.Status)
            .IsRequired()
            .HasConversion(
                v => v.ToString(),
                v => (UserStatus)Enum.Parse(typeof(UserStatus), v))
            .HasMaxLength(50);

        builder.Property(u => u.CreatedAt)
            .IsRequired()
            .HasConversion(
                v => v,
                v => new DateTime(v.Ticks, DateTimeKind.Utc));

        builder.Property(u => u.UpdatedAt)
            .IsRequired(false)
            .HasConversion(
                v => v,
                v => v.HasValue ? new DateTime(v.Value.Ticks, DateTimeKind.Utc) : (DateTime?)null);
    }
}

