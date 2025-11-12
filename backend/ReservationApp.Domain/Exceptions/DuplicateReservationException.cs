namespace ReservationApp.Domain.Exceptions;

public class DuplicateReservationException : DomainException
{
    public DuplicateReservationException(DateTime date, string mealTimeSlotName)
        : base($"You already have a reservation for {date:yyyy-MM-dd} at {mealTimeSlotName}. Each user can only have one reservation per meal time slot per day.")
    {
    }

    public DuplicateReservationException(string message) : base(message)
    {
    }
}

