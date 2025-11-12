namespace ReservationApp.Domain.Exceptions;

public class WeeklyLimitExceededException : DomainException
{
    public WeeklyLimitExceededException(int limit, int currentCount)
        : base($"You have reached the weekly reservation limit of {limit}. You currently have {currentCount} reservation(s) this week.")
    {
    }

    public WeeklyLimitExceededException(string message) : base(message)
    {
    }
}

