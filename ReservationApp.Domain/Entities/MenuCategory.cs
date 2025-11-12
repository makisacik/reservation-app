using ReservationApp.Domain.Exceptions;

namespace ReservationApp.Domain.Entities;

public class MenuCategory
{
    public Guid Id { get; private set; }
    public string Name { get; private set; } = string.Empty;
    public DateTime CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; private set; }

    // Navigation properties
    public ICollection<Meal> Meals { get; private set; } = new List<Meal>();

    private MenuCategory() { } // For EF Core

    public MenuCategory(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            throw new DomainException("Menu category name cannot be empty.");
        }

        Id = Guid.NewGuid();
        Name = name;
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = null;
    }

    public void Update(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            throw new DomainException("Menu category name cannot be empty.");
        }

        Name = name;
        UpdatedAt = DateTime.UtcNow;
    }
}

