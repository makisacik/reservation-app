using FluentValidation;
using ReservationApp.Application.DTOs;

namespace ReservationApp.Application.Validation;

public class CreateReservationDtoValidator : AbstractValidator<CreateReservationDto>
{
    public CreateReservationDtoValidator()
    {
        RuleFor(x => x.CustomerName)
            .NotEmpty().WithMessage("Customer name is required.")
            .MaximumLength(200).WithMessage("Customer name must not exceed 200 characters.");

        RuleFor(x => x.Date)
            .NotEmpty().WithMessage("Date is required.")
            .Must(date => date >= DateTime.UtcNow.Date).WithMessage("Reservation date cannot be in the past.");

        RuleFor(x => x.Guests)
            .GreaterThan(0).WithMessage("Number of guests must be greater than zero.")
            .LessThanOrEqualTo(50).WithMessage("Number of guests cannot exceed 50.");
    }
}

