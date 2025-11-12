using ReservationApp.Domain.Enums;

namespace ReservationApp.Application.DTOs;

public class UserFilterDto
{
    public string? Department { get; set; }
    public UserStatus? Status { get; set; }
    public UserRole? Role { get; set; }
    public string? Search { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}

