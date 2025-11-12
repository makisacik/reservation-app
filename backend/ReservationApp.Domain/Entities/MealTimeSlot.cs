using ReservationApp.Domain.Exceptions;

namespace ReservationApp.Domain.Entities;

public class MealTimeSlot
{
    public int Id { get; private set; }
    public string Name { get; private set; } = string.Empty;
    public TimeOnly StartTime { get; private set; }
    public TimeOnly EndTime { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; private set; }

    private MealTimeSlot() { } // For EF Core

    public MealTimeSlot(string name, TimeOnly startTime, TimeOnly endTime)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            throw new DomainException("Meal time slot name cannot be empty.");
        }

        if (endTime <= startTime)
        {
            throw new DomainException("End time must be after start time.");
        }

        Name = name;
        StartTime = startTime;
        EndTime = endTime;
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = null;
    }

    public void Update(string name, TimeOnly startTime, TimeOnly endTime)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            throw new DomainException("Meal time slot name cannot be empty.");
        }

        if (endTime <= startTime)
        {
            throw new DomainException("End time must be after start time.");
        }

        Name = name;
        StartTime = startTime;
        EndTime = endTime;
        UpdatedAt = DateTime.UtcNow;
    }
}

