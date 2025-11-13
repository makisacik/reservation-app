using ReservationApp.Domain.Enums;

namespace ReservationApp.Application.DTOs;

public class ReservationDto
{
    public Guid Id { get; set; }
    public string ReservationNumber { get; set; } = string.Empty;
    public Guid UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public Guid RestaurantId { get; set; }
    public string RestaurantName { get; set; } = string.Empty;
    public Guid MenuId { get; set; }
    public string MenuName { get; set; } = string.Empty;
    public DateTime MenuDate { get; set; }
    public int MealTimeSlotId { get; set; }
    public string MealTimeSlotName { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public bool Appetizer { get; set; }
    public ReservationStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

