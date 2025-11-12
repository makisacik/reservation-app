using ReservationApp.Domain.Enums;
using ReservationApp.Domain.Exceptions;

namespace ReservationApp.Domain.Entities;

public class SystemSetting
{
    public Guid Id { get; private set; }
    public string Key { get; private set; } = string.Empty;
    public string Value { get; private set; } = string.Empty;
    public SettingType Type { get; private set; }
    public string? Description { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; private set; }

    private SystemSetting() { } // For EF Core

    public SystemSetting(string key, string value, SettingType type, string? description = null)
    {
        if (string.IsNullOrWhiteSpace(key))
        {
            throw new DomainException("Setting key cannot be empty.");
        }

        if (string.IsNullOrWhiteSpace(value))
        {
            throw new DomainException("Setting value cannot be empty.");
        }

        Id = Guid.NewGuid();
        Key = key;
        Value = value;
        Type = type;
        Description = description;
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = null;
    }

    public void UpdateValue(string newValue)
    {
        if (string.IsNullOrWhiteSpace(newValue))
        {
            throw new DomainException("Setting value cannot be empty.");
        }

        Value = newValue;
        UpdatedAt = DateTime.UtcNow;
    }

    public void UpdateDescription(string? description)
    {
        Description = description;
        UpdatedAt = DateTime.UtcNow;
    }

    public T GetValue<T>()
    {
        return Type switch
        {
            SettingType.Int when typeof(T) == typeof(int) => (T)(object)int.Parse(Value),
            SettingType.Bool when typeof(T) == typeof(bool) => (T)(object)bool.Parse(Value),
            SettingType.String when typeof(T) == typeof(string) => (T)(object)Value,
            _ => throw new DomainException($"Cannot convert setting value to type {typeof(T).Name}.")
        };
    }
}

