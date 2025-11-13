using Microsoft.AspNetCore.Mvc.ModelBinding;
using System.Globalization;

namespace ReservationApp.API.ModelBinders;

public class UtcDateTimeModelBinder : IModelBinder
{
    public Task BindModelAsync(ModelBindingContext bindingContext)
    {
        if (bindingContext.ModelType != typeof(DateTime) && bindingContext.ModelType != typeof(DateTime?))
        {
            return Task.CompletedTask;
        }

        var valueProviderResult = bindingContext.ValueProvider.GetValue(bindingContext.ModelName);
        if (valueProviderResult == ValueProviderResult.None)
        {
            return Task.CompletedTask;
        }

        bindingContext.ModelState.SetModelValue(bindingContext.ModelName, valueProviderResult);

        var value = valueProviderResult.FirstValue;
        if (string.IsNullOrEmpty(value))
        {
            return Task.CompletedTask;
        }

        if (DateTime.TryParse(value, CultureInfo.InvariantCulture, DateTimeStyles.None, out var dateTime))
        {
            // If the DateTime is Unspecified, treat it as Turkey timezone and convert to UTC
            if (dateTime.Kind == DateTimeKind.Unspecified)
            {
                var turkeyTz = TimeZoneInfo.FindSystemTimeZoneById("Europe/Istanbul");
                var turkeyDateTimeOffset = new DateTimeOffset(
                    dateTime.Year,
                    dateTime.Month,
                    dateTime.Day,
                    dateTime.Hour,
                    dateTime.Minute,
                    dateTime.Second,
                    turkeyTz.GetUtcOffset(DateTimeOffset.UtcNow));
                dateTime = turkeyDateTimeOffset.UtcDateTime;
            }
            else if (dateTime.Kind == DateTimeKind.Local)
            {
                dateTime = dateTime.ToUniversalTime();
            }

            bindingContext.Result = ModelBindingResult.Success(dateTime);
        }
        else
        {
            bindingContext.ModelState.TryAddModelError(
                bindingContext.ModelName,
                $"Invalid date format: {value}");
        }

        return Task.CompletedTask;
    }
}

