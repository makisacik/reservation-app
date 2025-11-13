namespace ReservationApp.Application.DTOs;

public class DashboardSummaryDto
{
    public int TotalReservations { get; set; }
    public double TotalReservationsChangePercent { get; set; }
    public int ActiveUsers { get; set; }
    public double ActiveUsersChangePercent { get; set; }
    public int TodayMeals { get; set; }
    public double TodayMealsChangePercent { get; set; }
    public decimal MonthlyCost { get; set; }
    public double MonthlyCostChangePercent { get; set; }
    // Legacy fields for backward compatibility
    public int TotalUsers { get; set; }
    public int TotalMeals { get; set; }
    public int TotalRestaurants { get; set; }
}

