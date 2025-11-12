using ReservationApp.Domain.Exceptions;

namespace ReservationApp.Domain.Entities;

public class Meal
{
    public Guid Id { get; private set; }
    public string Name { get; private set; } = string.Empty;
    public string? Description { get; private set; }
    public int? Kcal { get; private set; }
    public Guid CategoryId { get; private set; }
    public Guid RestaurantId { get; private set; }
    public string? ImageUrl { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; private set; }

    // Navigation properties
    public MenuCategory Category { get; private set; } = null!;
    public Restaurant Restaurant { get; private set; } = null!;
    public ICollection<Menu> Menus { get; private set; } = new List<Menu>();

    private Meal() { } // For EF Core

    public Meal(string name, Guid categoryId, Guid restaurantId, string? description = null, int? kcal = null, string? imageUrl = null)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            throw new DomainException("Meal name cannot be empty.");
        }

        if (categoryId == Guid.Empty)
        {
            throw new DomainException("Category ID cannot be empty.");
        }

        if (restaurantId == Guid.Empty)
        {
            throw new DomainException("Restaurant ID cannot be empty.");
        }

        Id = Guid.NewGuid();
        Name = name;
        CategoryId = categoryId;
        RestaurantId = restaurantId;
        Description = description;
        Kcal = kcal;
        ImageUrl = imageUrl;
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = null;
    }

    public void Update(string name, Guid categoryId, string? description = null, int? kcal = null, string? imageUrl = null)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            throw new DomainException("Meal name cannot be empty.");
        }

        if (categoryId == Guid.Empty)
        {
            throw new DomainException("Category ID cannot be empty.");
        }

        Name = name;
        CategoryId = categoryId;
        Description = description;
        Kcal = kcal;
        ImageUrl = imageUrl;
        UpdatedAt = DateTime.UtcNow;
    }
}

