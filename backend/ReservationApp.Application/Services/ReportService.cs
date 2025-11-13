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
        var totalReservations = await _reportRepository.CountReservationsAsync(cancellationToken);
        var totalUsers = await _reportRepository.CountUsersAsync(cancellationToken);
        var totalMeals = await _reportRepository.CountMealsAsync(cancellationToken);
        var totalRestaurants = await _reportRepository.CountRestaurantsAsync(cancellationToken);

        return new DashboardSummaryDto
        {
            TotalReservations = totalReservations,
            TotalUsers = totalUsers,
            TotalMeals = totalMeals,
            TotalRestaurants = totalRestaurants
        };
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
}

