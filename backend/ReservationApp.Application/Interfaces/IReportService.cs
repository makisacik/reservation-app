using ReservationApp.Application.DTOs;

namespace ReservationApp.Application.Interfaces;

public interface IReportService
{
    Task<DashboardSummaryDto> GetSummaryAsync(CancellationToken cancellationToken = default);
    Task<IEnumerable<PopularMealDto>> GetPopularMealsAsync(int count = 10, CancellationToken cancellationToken = default);
    Task<IEnumerable<WeeklyTrendDto>> GetWeeklyTrendsAsync(DateTime? startDate = null, DateTime? endDate = null, CancellationToken cancellationToken = default);
    Task<HomePageStatsDto> GetHomePageStatsAsync(CancellationToken cancellationToken = default);
}

