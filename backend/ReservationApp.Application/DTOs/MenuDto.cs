using ReservationApp.Domain.Enums;

namespace ReservationApp.Application.DTOs;

public class MenuDto
{
    public Guid Id { get; set; }
    public Guid RestaurantId { get; set; }
    public string RestaurantName { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public MenuType MenuType { get; set; }
    public List<MealDto> Meals { get; set; } = new();
}

