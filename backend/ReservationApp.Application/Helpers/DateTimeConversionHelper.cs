namespace ReservationApp.Application.Helpers;

/// <summary>
/// Static helper class for DateTime conversions in stateless components (JSON converters, EF Core configs).
/// This helper uses a default timezone and can be initialized with a timezone service at application startup.
/// </summary>
public static class DateTimeConversionHelper
{
    private static TimeZoneInfo? _applicationTimezone;
    private const string DefaultTimezone = "Europe/Istanbul";

    /// <summary>
    /// Initializes the helper with the application timezone.
    /// Should be called at application startup after DI container is built.
    /// </summary>
    public static void Initialize(TimeZoneInfo timezone)
    {
        _applicationTimezone = timezone;
    }

    /// <summary>
    /// Gets the application timezone, using cached value or default.
    /// </summary>
    private static TimeZoneInfo GetApplicationTimezone()
    {
        if (_applicationTimezone != null)
        {
            return _applicationTimezone;
        }

        // Fallback to default timezone if not initialized
        try
        {
            return TimeZoneInfo.FindSystemTimeZoneById(DefaultTimezone);
        }
        catch
        {
            return TimeZoneInfo.Utc;
        }
    }

    /// <summary>
    /// Converts a DateTime to UTC using the application timezone.
    /// Handles Unspecified, Local, and UTC DateTimeKind values.
    /// </summary>
    public static DateTime ConvertToUtc(DateTime dateTime)
    {
        if (dateTime.Kind == DateTimeKind.Utc)
        {
            return dateTime;
        }

        var timezone = GetApplicationTimezone();

        if (dateTime.Kind == DateTimeKind.Unspecified)
        {
            // Treat Unspecified as application timezone and convert to UTC
            var dateTimeOffset = new DateTimeOffset(
                dateTime.Year,
                dateTime.Month,
                dateTime.Day,
                dateTime.Hour,
                dateTime.Minute,
                dateTime.Second,
                timezone.GetUtcOffset(DateTimeOffset.UtcNow));
            return dateTimeOffset.UtcDateTime;
        }

        // Local time, convert to UTC
        return dateTime.ToUniversalTime();
    }

    /// <summary>
    /// Converts a UTC DateTime to the application timezone.
    /// </summary>
    public static DateTime ConvertFromUtc(DateTime utcDateTime)
    {
        if (utcDateTime.Kind != DateTimeKind.Utc)
        {
            // Ensure it's UTC
            utcDateTime = new DateTime(utcDateTime.Ticks, DateTimeKind.Utc);
        }

        var timezone = GetApplicationTimezone();
        return TimeZoneInfo.ConvertTimeFromUtc(utcDateTime, timezone);
    }
}

