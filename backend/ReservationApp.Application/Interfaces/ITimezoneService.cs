namespace ReservationApp.Application.Interfaces;

public interface ITimezoneService
{
    /// <summary>
    /// Gets the application timezone from database settings.
    /// </summary>
    Task<TimeZoneInfo> GetApplicationTimezoneAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Converts a DateTime to UTC using the application timezone.
    /// Handles Unspecified, Local, and UTC DateTimeKind values.
    /// </summary>
    Task<DateTime> ConvertToUtcAsync(DateTime dateTime, CancellationToken cancellationToken = default);

    /// <summary>
    /// Converts a UTC DateTime to the application timezone.
    /// </summary>
    Task<DateTime> ConvertFromUtcAsync(DateTime utcDateTime, CancellationToken cancellationToken = default);

    /// <summary>
    /// Synchronous version of ConvertToUtcAsync for use in synchronous contexts.
    /// Uses cached timezone if available, otherwise falls back to default.
    /// </summary>
    DateTime ConvertToUtc(DateTime dateTime);

    /// <summary>
    /// Synchronous version of ConvertFromUtcAsync for use in synchronous contexts.
    /// Uses cached timezone if available, otherwise falls back to default.
    /// </summary>
    DateTime ConvertFromUtc(DateTime utcDateTime);
}

