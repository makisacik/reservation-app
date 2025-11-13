using Microsoft.AspNetCore.Mvc.ModelBinding;
using ReservationApp.Application.Helpers;
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
            // Convert to UTC using application timezone
            dateTime = DateTimeConversionHelper.ConvertToUtc(dateTime);
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

