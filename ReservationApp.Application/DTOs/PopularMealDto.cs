namespace ReservationApp.Application.DTOs;

public class PopularMealDto
{
    public Guid MealId { get; set; }
    public string MealName { get; set; } = string.Empty;
    public int ReservationCount { get; set; }
}

