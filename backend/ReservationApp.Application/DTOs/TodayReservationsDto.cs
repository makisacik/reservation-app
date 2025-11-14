namespace ReservationApp.Application.DTOs;

public class TodayReservationsDto
{
    public string MealTimeSlotName { get; set; } = string.Empty;
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }
    public string RestaurantName { get; set; } = string.Empty;
    public int ReservationCount { get; set; }
}



