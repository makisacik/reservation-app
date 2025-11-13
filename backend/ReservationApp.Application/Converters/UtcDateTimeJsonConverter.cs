using System.Text.Json;
using System.Text.Json.Serialization;

namespace ReservationApp.Application.Converters;

public class UtcDateTimeJsonConverter : JsonConverter<DateTime>
{
    public override DateTime Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        try
        {
            if (reader.TokenType == JsonTokenType.String)
            {
                var dateString = reader.GetString();
                Console.WriteLine($"[JSON Converter] Reading DateTime string: {dateString}");
                
                if (DateTime.TryParse(dateString, out var dateTime))
                {
                    Console.WriteLine($"[JSON Converter] Parsed DateTime: {dateTime}, Kind: {dateTime.Kind}");
                    
                    // If the DateTime is Unspecified, treat it as Turkey timezone and convert to UTC
                    if (dateTime.Kind == DateTimeKind.Unspecified)
                    {
                        Console.WriteLine("[JSON Converter] Converting Unspecified to UTC (Turkey timezone)");
                        var turkeyTz = TimeZoneInfo.FindSystemTimeZoneById("Europe/Istanbul");
                        var turkeyDateTimeOffset = new DateTimeOffset(
                            dateTime.Year,
                            dateTime.Month,
                            dateTime.Day,
                            dateTime.Hour,
                            dateTime.Minute,
                            dateTime.Second,
                            turkeyTz.GetUtcOffset(DateTimeOffset.UtcNow));
                        var utcDateTime = turkeyDateTimeOffset.UtcDateTime;
                        Console.WriteLine($"[JSON Converter] Converted to UTC: {utcDateTime}, Kind: {utcDateTime.Kind}");
                        return utcDateTime;
                    }
                    else if (dateTime.Kind == DateTimeKind.Local)
                    {
                        Console.WriteLine("[JSON Converter] Converting Local to UTC");
                        var utcDateTime = dateTime.ToUniversalTime();
                        Console.WriteLine($"[JSON Converter] Converted to UTC: {utcDateTime}, Kind: {utcDateTime.Kind}");
                        return utcDateTime;
                    }
                    // Already UTC
                    Console.WriteLine($"[JSON Converter] DateTime already UTC: {dateTime}");
                    return dateTime;
                }
                else
                {
                    Console.WriteLine($"[JSON Converter] Failed to parse DateTime string: {dateString}");
                }
            }
            else
            {
                Console.WriteLine($"[JSON Converter] Token type is not String: {reader.TokenType}");
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[JSON Converter] Exception: {ex.Message}");
            throw;
        }
        
        // Fallback to default parsing
        Console.WriteLine("[JSON Converter] Using fallback: reader.GetDateTime()");
        var fallback = reader.GetDateTime();
        Console.WriteLine($"[JSON Converter] Fallback result: {fallback}, Kind: {fallback.Kind}");
        return fallback;
    }

    public override void Write(Utf8JsonWriter writer, DateTime value, JsonSerializerOptions options)
    {
        // Ensure we write UTC DateTime
        var utcValue = value.Kind == DateTimeKind.Utc ? value : value.ToUniversalTime();
        writer.WriteStringValue(utcValue.ToString("yyyy-MM-ddTHH:mm:ssZ"));
    }
}

