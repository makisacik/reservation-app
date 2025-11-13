namespace ReservationApp.Application.DTOs;

public class UserStatisticsDto
{
    public int TotalUsers { get; set; }
    public int ActiveUsers { get; set; }
    public int PassiveUsers { get; set; }
    public int NewThisMonth { get; set; }
}

