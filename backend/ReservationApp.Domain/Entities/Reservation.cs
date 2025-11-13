using ReservationApp.Domain.Enums;
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
    public ReservationStatus Status { get; private set; } = ReservationStatus.Pending;
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
        // Store only date part, explicitly as UTC for PostgreSQL compatibility
        Date = new DateTime(date.Year, date.Month, date.Day, 0, 0, 0, DateTimeKind.Utc);
        Appetizer = appetizer;
        // All new reservations default to Pending status - must be approved by admin
        Status = ReservationStatus.Pending;
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
        // Store only date part, explicitly as UTC for PostgreSQL compatibility
        Date = new DateTime(date.Year, date.Month, date.Day, 0, 0, 0, DateTimeKind.Utc);
        Appetizer = appetizer;
        UpdatedAt = DateTime.UtcNow;

        Validate();
    }

    public void Approve()
    {
        if (Status != ReservationStatus.Pending)
        {
            throw new DomainException("Only pending reservations can be approved.");
        }

        Status = ReservationStatus.Active;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Cancel()
    {
        Status = ReservationStatus.Cancelled;
        UpdatedAt = DateTime.UtcNow;
    }

    private void Validate()
    {
        if (Date < DateTime.UtcNow.Date)
        {
            throw new DomainException("Reservation date cannot be in the past.");
        }
    }
}

