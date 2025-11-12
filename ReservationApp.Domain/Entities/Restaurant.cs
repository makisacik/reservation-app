using ReservationApp.Domain.Exceptions;

namespace ReservationApp.Domain.Entities;

public class Restaurant
{
    public Guid Id { get; private set; }
    public string Name { get; private set; } = string.Empty;
    public string? Description { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; private set; }

    // Navigation properties
    public ICollection<Menu> Menus { get; private set; } = new List<Menu>();
    public ICollection<Meal> Meals { get; private set; } = new List<Meal>();

    private Restaurant() { } // For EF Core

    public Restaurant(string name, string? description = null)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            throw new DomainException("Restaurant name cannot be empty.");
        }

        Id = Guid.NewGuid();
        Name = name;
        Description = description;
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = null;
    }

    public void Update(string name, string? description = null)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            throw new DomainException("Restaurant name cannot be empty.");
        }

        Name = name;
        Description = description;
        UpdatedAt = DateTime.UtcNow;
    }
}

