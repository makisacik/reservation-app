using ReservationApp.Domain.Enums;
using ReservationApp.Domain.Exceptions;

namespace ReservationApp.Domain.Entities;

public class Menu
{
    public Guid Id { get; private set; }
    public Guid RestaurantId { get; private set; }
    public DateTime Date { get; private set; }
    public MenuType MenuType { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; private set; }

    // Navigation properties
    public Restaurant Restaurant { get; private set; } = null!;
    public ICollection<Meal> Meals { get; private set; } = new List<Meal>();

    private Menu() { } // For EF Core

    public Menu(Guid restaurantId, DateTime date, MenuType menuType)
    {
        if (restaurantId == Guid.Empty)
        {
            throw new DomainException("Restaurant ID cannot be empty.");
        }

        Id = Guid.NewGuid();
        RestaurantId = restaurantId;
        Date = date.Date; // Store only date part
        MenuType = menuType;
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = null;
    }

    public void Update(DateTime date, MenuType menuType)
    {
        Date = date.Date; // Store only date part
        MenuType = menuType;
        UpdatedAt = DateTime.UtcNow;
    }
}

