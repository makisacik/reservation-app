namespace ReservationApp.Application.DTOs;

public class ReservationSummaryDto
{
    public int TodayCount { get; set; }
    public int ThisWeekCount { get; set; }
    public int ThisMonthCount { get; set; }
    public int PendingCount { get; set; }
}

