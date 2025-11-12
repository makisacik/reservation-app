using FluentValidation;
using ReservationApp.Application.DTOs;

namespace ReservationApp.Application.Validation;

public class UserUpdateDtoValidator : AbstractValidator<UserUpdateDto>
{
    public UserUpdateDtoValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Name is required.")
            .MaximumLength(200).WithMessage("Name cannot exceed 200 characters.");

        RuleFor(x => x.Department)
            .MaximumLength(100).WithMessage("Department cannot exceed 100 characters.")
            .When(x => !string.IsNullOrEmpty(x.Department));

        RuleFor(x => x.Role)
            .IsInEnum().WithMessage("Invalid role.");

        RuleFor(x => x.Status)
            .IsInEnum().WithMessage("Invalid status.");
    }
}

