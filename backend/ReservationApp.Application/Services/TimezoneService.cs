using Microsoft.Extensions.Caching.Memory;
using ReservationApp.Application.Interfaces;

namespace ReservationApp.Application.Services;

public class TimezoneService : ITimezoneService
{
    private readonly ISettingService _settingService;
    private readonly IMemoryCache _cache;
    private const string TimezoneCacheKey = "ApplicationTimezone";
    private const string DefaultTimezone = "Europe/Istanbul";
    private const int CacheExpirationMinutes = 60;

    public TimezoneService(ISettingService settingService, IMemoryCache cache)
    {
        _settingService = settingService;
        _cache = cache;
    }

    public async Task<TimeZoneInfo> GetApplicationTimezoneAsync(CancellationToken cancellationToken = default)
    {
        // Try to get from cache first
        if (_cache.TryGetValue(TimezoneCacheKey, out TimeZoneInfo? cachedTimezone))
        {
            return cachedTimezone!;
        }

        // Get timezone string from database settings
        var timezoneStr = await _settingService.GetValueAsync<string>(
            "General",
            "Timezone",
            DefaultTimezone,
            cancellationToken) ?? DefaultTimezone;

        TimeZoneInfo timezone;
        try
        {
            timezone = TimeZoneInfo.FindSystemTimeZoneById(timezoneStr);
        }
        catch
        {
            // If timezone is invalid, fallback to UTC
            timezone = TimeZoneInfo.Utc;
        }

        // Cache the timezone object
        _cache.Set(TimezoneCacheKey, timezone, TimeSpan.FromMinutes(CacheExpirationMinutes));

        return timezone;
    }

    public async Task<DateTime> ConvertToUtcAsync(DateTime dateTime, CancellationToken cancellationToken = default)
    {
        if (dateTime.Kind == DateTimeKind.Utc)
        {
            return dateTime;
        }

        var timezone = await GetApplicationTimezoneAsync(cancellationToken);

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

    public async Task<DateTime> ConvertFromUtcAsync(DateTime utcDateTime, CancellationToken cancellationToken = default)
    {
        if (utcDateTime.Kind != DateTimeKind.Utc)
        {
            // Ensure it's UTC
            utcDateTime = new DateTime(utcDateTime.Ticks, DateTimeKind.Utc);
        }

        var timezone = await GetApplicationTimezoneAsync(cancellationToken);
        return TimeZoneInfo.ConvertTimeFromUtc(utcDateTime, timezone);
    }

    public DateTime ConvertToUtc(DateTime dateTime)
    {
        if (dateTime.Kind == DateTimeKind.Utc)
        {
            return dateTime;
        }

        // Try to get cached timezone, otherwise use default
        TimeZoneInfo timezone;
        if (_cache.TryGetValue(TimezoneCacheKey, out TimeZoneInfo? cachedTimezone))
        {
            timezone = cachedTimezone!;
        }
        else
        {
            // Fallback to default timezone if not cached
            try
            {
                timezone = TimeZoneInfo.FindSystemTimeZoneById(DefaultTimezone);
            }
            catch
            {
                timezone = TimeZoneInfo.Utc;
            }
        }

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

    public DateTime ConvertFromUtc(DateTime utcDateTime)
    {
        if (utcDateTime.Kind != DateTimeKind.Utc)
        {
            // Ensure it's UTC
            utcDateTime = new DateTime(utcDateTime.Ticks, DateTimeKind.Utc);
        }

        // Try to get cached timezone, otherwise use default
        TimeZoneInfo timezone;
        if (_cache.TryGetValue(TimezoneCacheKey, out TimeZoneInfo? cachedTimezone))
        {
            timezone = cachedTimezone!;
        }
        else
        {
            // Fallback to default timezone if not cached
            try
            {
                timezone = TimeZoneInfo.FindSystemTimeZoneById(DefaultTimezone);
            }
            catch
            {
                timezone = TimeZoneInfo.Utc;
            }
        }

        return TimeZoneInfo.ConvertTimeFromUtc(utcDateTime, timezone);
    }
}

