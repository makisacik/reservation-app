using ReservationApp.Domain.Enums;

namespace ReservationApp.Application.DTOs;

public class AdminCreateUserDto
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string? Department { get; set; }
    public UserRole Role { get; set; } = UserRole.User;
}

