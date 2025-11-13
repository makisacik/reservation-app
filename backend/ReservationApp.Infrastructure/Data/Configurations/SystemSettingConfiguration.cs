using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ReservationApp.Domain.Entities;
using ReservationApp.Domain.Enums;

namespace ReservationApp.Infrastructure.Data.Configurations;

public class SystemSettingConfiguration : IEntityTypeConfiguration<SystemSetting>
{
    public void Configure(EntityTypeBuilder<SystemSetting> builder)
    {
        builder.ToTable("SystemSettings");

        builder.HasKey(s => s.Id);

        builder.Property(s => s.Id)
            .IsRequired();

        builder.Property(s => s.Category)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(s => s.Key)
            .IsRequired()
            .HasMaxLength(200);

        builder.HasIndex(s => new { s.Category, s.Key })
            .IsUnique();

        builder.Property(s => s.Value)
            .IsRequired()
            .HasMaxLength(500);

        builder.Property(s => s.Type)
            .IsRequired()
            .HasConversion(
                v => v.ToString(),
                v => (SettingType)Enum.Parse(typeof(SettingType), v))
            .HasMaxLength(50);

        builder.Property(s => s.Description)
            .HasMaxLength(1000);

        builder.Property(s => s.CreatedAt)
            .IsRequired()
            .HasConversion(
                v => v,
                v => new DateTime(v.Ticks, DateTimeKind.Utc));

        builder.Property(s => s.UpdatedAt)
            .IsRequired(false)
            .HasConversion(
                v => v,
                v => v.HasValue ? new DateTime(v.Value.Ticks, DateTimeKind.Utc) : (DateTime?)null);
    }
}

