namespace ReservationApp.Application.DTOs;

public class MealCreateDto
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int? Kcal { get; set; }
    public decimal? Price { get; set; }
    public Guid CategoryId { get; set; }
    public Guid RestaurantId { get; set; }
    public string? ImageUrl { get; set; }
}

