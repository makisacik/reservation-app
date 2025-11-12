using ReservationApp.Domain.Enums;

namespace ReservationApp.Application.DTOs;

public class MenuUpdateDto
{
    public DateTime Date { get; set; }
    public MenuType MenuType { get; set; }
    public List<Guid> MealIds { get; set; } = new();
}

