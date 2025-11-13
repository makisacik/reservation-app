using FluentValidation;
using ReservationApp.Application.DTOs;

namespace ReservationApp.Application.Validation;

public class CreateReservationDtoValidator : AbstractValidator<CreateReservationDto>
{
    private const int MaxAdvanceBookingDays = 365;

    public CreateReservationDtoValidator()
    {
        RuleFor(x => x.RestaurantId)
            .NotEmpty().WithMessage("Restaurant ID is required.");

        RuleFor(x => x.MenuId)
            .NotEmpty().WithMessage("Menu ID is required.");

        RuleFor(x => x.MealTimeSlotId)
            .GreaterThan(0).WithMessage("Meal time slot ID must be greater than zero.");

        RuleFor(x => x.Date)
            .NotEmpty().WithMessage("Date is required.")
            .Must(date => 
            {
                var utcDate = ConvertToUtc(date);
                var utcNow = DateTime.UtcNow;
                return utcDate.Date >= utcNow.Date;
            })
                .WithMessage("Reservation date cannot be in the past.")
            .Must(date => 
            {
                var utcDate = ConvertToUtc(date);
                var utcNow = DateTime.UtcNow;
                return utcDate.Date <= utcNow.Date.AddDays(MaxAdvanceBookingDays);
            })
                .WithMessage($"Reservation date cannot be more than {MaxAdvanceBookingDays} days in the future.");

        // Appetizer is optional boolean, no validation needed
    }

    private static DateTime ConvertToUtc(DateTime date)
    {
        // Convert to UTC for comparison
        // Treat Unspecified dates as Turkey timezone (Europe/Istanbul)
        if (date.Kind == DateTimeKind.Utc)
        {
            return date;
        }
        
        if (date.Kind == DateTimeKind.Unspecified)
        {
            // Treat as Turkey timezone and convert to UTC
            var turkeyTz = TimeZoneInfo.FindSystemTimeZoneById("Europe/Istanbul");
            var turkeyDateTimeOffset = new DateTimeOffset(
                date.Year, date.Month, date.Day, 
                date.Hour, date.Minute, date.Second, 
                turkeyTz.GetUtcOffset(DateTimeOffset.UtcNow));
            return turkeyDateTimeOffset.UtcDateTime;
        }
        
        return date.ToUniversalTime();
    }
}

