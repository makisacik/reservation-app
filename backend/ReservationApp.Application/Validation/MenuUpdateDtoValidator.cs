using FluentValidation;
using ReservationApp.Application.DTOs;

namespace ReservationApp.Application.Validation;

public class MenuUpdateDtoValidator : AbstractValidator<MenuUpdateDto>
{
    public MenuUpdateDtoValidator()
    {
        RuleFor(x => x.Date)
            .NotEmpty().WithMessage("Date is required.");

        RuleFor(x => x.MenuType)
            .IsInEnum().WithMessage("Invalid menu type.");

        RuleFor(x => x.MealIds)
            .NotNull().WithMessage("Meal IDs cannot be null.");
    }
}

