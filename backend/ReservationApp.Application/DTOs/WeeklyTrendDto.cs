namespace ReservationApp.Application.DTOs;

public class WeeklyTrendDto
{
    public DateTime WeekStart { get; set; }
    public DateTime WeekEnd { get; set; }
    public int ReservationCount { get; set; }
}

