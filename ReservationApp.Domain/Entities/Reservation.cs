using ReservationApp.Domain.Exceptions;

namespace ReservationApp.Domain.Entities;

public class Reservation
{
    public Guid Id { get; private set; }
    public Guid UserId { get; private set; }
    public Guid RestaurantId { get; private set; }
    public Guid MenuId { get; private set; }
    public int MealTimeSlotId { get; private set; }
    public DateTime Date { get; private set; }
    public bool Appetizer { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; private set; }

    // Navigation properties
    public User User { get; private set; } = null!;
    public Restaurant Restaurant { get; private set; } = null!;
    public Menu Menu { get; private set; } = null!;
    public MealTimeSlot MealTimeSlot { get; private set; } = null!;

    private Reservation() { } // For EF Core

    public Reservation(Guid userId, Guid restaurantId, Guid menuId, int mealTimeSlotId, DateTime date, bool appetizer = false)
    {
        if (userId == Guid.Empty)
        {
            throw new DomainException("User ID cannot be empty.");
        }

        if (restaurantId == Guid.Empty)
        {
            throw new DomainException("Restaurant ID cannot be empty.");
        }

        if (menuId == Guid.Empty)
        {
            throw new DomainException("Menu ID cannot be empty.");
        }

        Id = Guid.NewGuid();
        UserId = userId;
        RestaurantId = restaurantId;
        MenuId = menuId;
        MealTimeSlotId = mealTimeSlotId;
        Date = date.Date; // Store only date part
        Appetizer = appetizer;
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = null;

        Validate();
    }

    public void Update(Guid menuId, int mealTimeSlotId, DateTime date, bool appetizer = false)
    {
        if (menuId == Guid.Empty)
        {
            throw new DomainException("Menu ID cannot be empty.");
        }

        MenuId = menuId;
        MealTimeSlotId = mealTimeSlotId;
        Date = date.Date; // Store only date part
        Appetizer = appetizer;
        UpdatedAt = DateTime.UtcNow;

        Validate();
    }

    private void Validate()
    {
        if (Date < DateTime.UtcNow.Date)
        {
            throw new DomainException("Reservation date cannot be in the past.");
        }
    }
}

