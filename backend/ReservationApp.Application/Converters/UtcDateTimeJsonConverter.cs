using System.Text.Json;
using System.Text.Json.Serialization;
using ReservationApp.Application.Helpers;

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
                if (DateTime.TryParse(dateString, out var dateTime))
                {
                    // Convert to UTC using application timezone
                    return DateTimeConversionHelper.ConvertToUtc(dateTime);
                }
            }
        }
        catch
        {
            // Fall through to default parsing
        }
        
        // Fallback to default parsing
        var fallback = reader.GetDateTime();
        return DateTimeConversionHelper.ConvertToUtc(fallback);
    }

    public override void Write(Utf8JsonWriter writer, DateTime value, JsonSerializerOptions options)
    {
        // Ensure we write UTC DateTime
        var utcValue = value.Kind == DateTimeKind.Utc ? value : DateTimeConversionHelper.ConvertToUtc(value);
        writer.WriteStringValue(utcValue.ToString("yyyy-MM-ddTHH:mm:ssZ"));
    }
}

