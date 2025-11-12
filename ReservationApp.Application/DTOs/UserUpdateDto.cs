using ReservationApp.Domain.Enums;

namespace ReservationApp.Application.DTOs;

public class UserUpdateDto
{
    public string Name { get; set; } = string.Empty;
    public string? Department { get; set; }
    public UserRole Role { get; set; }
    public UserStatus Status { get; set; }
}

