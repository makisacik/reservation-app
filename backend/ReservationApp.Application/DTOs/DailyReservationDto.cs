namespace ReservationApp.Application.DTOs;

public class DailyReservationDto
{
    public string DayName { get; set; } = string.Empty;
    public string DayAbbreviation { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public int ReservationCount { get; set; }
}

