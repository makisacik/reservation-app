namespace ReservationApp.Domain.Exceptions;

public class InvalidReservationDateException : DomainException
{
    public InvalidReservationDateException(DateTime date)
        : base($"Reservation date {date:yyyy-MM-dd} is in the past. Reservations can only be made for today or future dates.")
    {
    }

    public InvalidReservationDateException(string message) : base(message)
    {
    }
}

