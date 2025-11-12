namespace ReservationApp.Application.DTOs;

public class MealUpdateDto
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int? Kcal { get; set; }
    public Guid CategoryId { get; set; }
    public string? ImageUrl { get; set; }
}

