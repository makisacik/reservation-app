using ReservationApp.Domain.Enums;

namespace ReservationApp.Application.DTOs;

public class MenuCreateDto
{
    public Guid RestaurantId { get; set; }
    public DateTime Date { get; set; }
    public MenuType MenuType { get; set; }
    public List<Guid> MealIds { get; set; } = new();
}

