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
            .Must(date => date >= DateTime.UtcNow.Date)
                .WithMessage("Reservation date cannot be in the past.")
            .Must(date => date <= DateTime.UtcNow.Date.AddDays(MaxAdvanceBookingDays))
                .WithMessage($"Reservation date cannot be more than {MaxAdvanceBookingDays} days in the future.");

        // Appetizer is optional boolean, no validation needed
    }
}

