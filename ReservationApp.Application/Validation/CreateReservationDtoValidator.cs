using FluentValidation;
using ReservationApp.Application.DTOs;

namespace ReservationApp.Application.Validation;

public class CreateReservationDtoValidator : AbstractValidator<CreateReservationDto>
{
    private const int MaxAdvanceBookingDays = 365;
    private const int MaxGuests = 50;
    private const int MinGuests = 1;

    public CreateReservationDtoValidator()
    {
        RuleFor(x => x.CustomerName)
            .NotEmpty().WithMessage("Customer name is required.")
            .MaximumLength(200).WithMessage("Customer name must not exceed 200 characters.");

        RuleFor(x => x.Date)
            .NotEmpty().WithMessage("Date is required.")
            .Must(date => date >= DateTime.UtcNow.Date)
                .WithMessage("Reservation date cannot be in the past.")
            .Must(date => date <= DateTime.UtcNow.Date.AddDays(MaxAdvanceBookingDays))
                .WithMessage($"Reservation date cannot be more than {MaxAdvanceBookingDays} days in the future.");

        RuleFor(x => x.Guests)
            .GreaterThan(0).WithMessage("Number of guests must be greater than zero.")
            .LessThanOrEqualTo(MaxGuests).WithMessage($"Number of guests cannot exceed {MaxGuests}.");

        // Cross-field validation: Ensure date and guests combination is valid
        RuleFor(x => x)
            .Must(dto => IsValidReservationDate(dto.Date))
                .WithMessage("Reservation date must be a valid future date.")
            .Must(dto => IsValidGuestCountForDate(dto.Date, dto.Guests))
                .WithMessage("The number of guests may be restricted for certain dates. Please contact us for large group reservations.")
            .OverridePropertyName("Reservation");
    }

    private static bool IsValidReservationDate(DateTime date)
    {
        var today = DateTime.UtcNow.Date;
        var maxDate = today.AddDays(MaxAdvanceBookingDays);
        return date >= today && date <= maxDate;
    }

    private static bool IsValidGuestCountForDate(DateTime date, int guests)
    {
        // Example cross-field logic: For dates far in the future, limit guest count
        var daysInAdvance = (date.Date - DateTime.UtcNow.Date).Days;
        
        // If booking more than 180 days in advance, limit to 20 guests
        if (daysInAdvance > 180 && guests > 20)
        {
            return false;
        }

        // If booking more than 90 days in advance, limit to 30 guests
        if (daysInAdvance > 90 && guests > 30)
        {
            return false;
        }

        return guests >= MinGuests && guests <= MaxGuests;
    }
}

