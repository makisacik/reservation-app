using ReservationApp.Application.DTOs;
using ReservationApp.Application.Interfaces;
using ReservationApp.Domain.Enums;

namespace ReservationApp.Application.Services;

public class ReportService : IReportService
{
    private readonly IReportRepository _reportRepository;

    public ReportService(IReportRepository reportRepository)
    {
        _reportRepository = reportRepository;
    }

    public async Task<DashboardSummaryDto> GetSummaryAsync(CancellationToken cancellationToken = default)
    {
        // Current period metrics
        var totalReservations = await _reportRepository.CountReservationsAsync(cancellationToken);
        var activeUsers = await _reportRepository.CountActiveUsersAsync(cancellationToken);
        var todayMeals = await _reportRepository.CountTodayMealsAsync(cancellationToken);
        var monthlyCost = await _reportRepository.CalculateMonthlyCostAsync(cancellationToken);

        // Previous period metrics for percentage calculations
        var previousReservations = await _reportRepository.CountReservationsPreviousPeriodAsync(cancellationToken);
        var previousActiveUsers = await _reportRepository.CountActiveUsersPreviousPeriodAsync(cancellationToken);
        var previousTodayMeals = await _reportRepository.CountTodayMealsPreviousPeriodAsync(cancellationToken);
        var previousMonthlyCost = await _reportRepository.CalculateMonthlyCostPreviousPeriodAsync(cancellationToken);

        // Calculate percentage changes
        var reservationsChangePercent = CalculatePercentageChange(previousReservations, totalReservations);
        var activeUsersChangePercent = CalculatePercentageChange(previousActiveUsers, activeUsers);
        var todayMealsChangePercent = CalculatePercentageChange(previousTodayMeals, todayMeals);
        var monthlyCostChangePercent = CalculatePercentageChange((double)previousMonthlyCost, (double)monthlyCost);

        // Legacy fields
        var totalUsers = await _reportRepository.CountUsersAsync(cancellationToken);
        var totalMeals = await _reportRepository.CountMealsAsync(cancellationToken);
        var totalRestaurants = await _reportRepository.CountRestaurantsAsync(cancellationToken);

        return new DashboardSummaryDto
        {
            TotalReservations = totalReservations,
            TotalReservationsChangePercent = reservationsChangePercent,
            ActiveUsers = activeUsers,
            ActiveUsersChangePercent = activeUsersChangePercent,
            TodayMeals = todayMeals,
            TodayMealsChangePercent = todayMealsChangePercent,
            MonthlyCost = monthlyCost,
            MonthlyCostChangePercent = monthlyCostChangePercent,
            TotalUsers = totalUsers,
            TotalMeals = totalMeals,
            TotalRestaurants = totalRestaurants
        };
    }

    private static double CalculatePercentageChange(double previous, double current)
    {
        if (previous == 0)
        {
            return current > 0 ? 100 : 0;
        }
        return Math.Round(((current - previous) / previous) * 100, 1);
    }

    public async Task<IEnumerable<PopularMealDto>> GetPopularMealsAsync(int count = 10, CancellationToken cancellationToken = default)
    {
        return await _reportRepository.GetPopularMealsAsync(count, ReservationStatus.Active, cancellationToken);
    }

    public async Task<IEnumerable<WeeklyTrendDto>> GetWeeklyTrendsAsync(DateTime? startDate = null, DateTime? endDate = null, CancellationToken cancellationToken = default)
    {
        // Default to last 28 days if not specified
        var defaultStartDate = DateTime.UtcNow.AddDays(-28);
        var start = startDate ?? defaultStartDate;
        var end = endDate ?? DateTime.UtcNow;

        return await _reportRepository.GetWeeklyTrendsAsync(start, end, ReservationStatus.Active, cancellationToken);
    }

    public async Task<HomePageStatsDto> GetHomePageStatsAsync(CancellationToken cancellationToken = default)
    {
        var totalMeals = await _reportRepository.CountMealsAsync(cancellationToken);
        var mostPopular = await _reportRepository.GetMostPopularMealNameAsync(cancellationToken);
        var todayMenuMealsCount = await _reportRepository.CountTodayMenuMealsAsync(cancellationToken);
        var aperatifCount = await _reportRepository.CountMealsByCategoryNameAsync("Mesai Aperatif", cancellationToken);

        // Calculate preference rate: (meals in today's menu / total meals) * 100
        // If totalMeals is 0, we should still show 0% instead of dividing by zero
        var preferenceRate = totalMeals > 0 
            ? (int)Math.Round((double)todayMenuMealsCount / totalMeals * 100) 
            : 0;

        return new HomePageStatsDto
        {
            TotalMeals = totalMeals,
            MostPopular = mostPopular,
            PreferenceRate = preferenceRate,
            AperatifCount = aperatifCount
        };
    }

    public async Task<IEnumerable<TodayReservationsDto>> GetTodayReservationsAsync(CancellationToken cancellationToken = default)
    {
        return await _reportRepository.GetTodayReservationsByTimeSlotAsync(cancellationToken);
    }

    public async Task<IEnumerable<DailyReservationDto>> GetDailyReservationsForWeekAsync(CancellationToken cancellationToken = default)
    {
        return await _reportRepository.GetDailyReservationsForWeekAsync(cancellationToken);
    }
}

