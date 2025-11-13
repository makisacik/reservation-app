using ReservationApp.Application.DTOs;
using ReservationApp.Domain.Enums;

namespace ReservationApp.Application.Interfaces;

public interface IReportRepository
{
    Task<int> CountReservationsAsync(CancellationToken cancellationToken = default);
    Task<int> CountUsersAsync(CancellationToken cancellationToken = default);
    Task<int> CountMealsAsync(CancellationToken cancellationToken = default);
    Task<int> CountRestaurantsAsync(CancellationToken cancellationToken = default);
    Task<IEnumerable<PopularMealDto>> GetPopularMealsAsync(int count, ReservationStatus status, CancellationToken cancellationToken = default);
    Task<IEnumerable<WeeklyTrendDto>> GetWeeklyTrendsAsync(DateTime startDate, DateTime endDate, ReservationStatus status, CancellationToken cancellationToken = default);
    Task<int> CountMealsByCategoryNameAsync(string categoryName, CancellationToken cancellationToken = default);
    Task<string> GetMostPopularMealNameAsync(CancellationToken cancellationToken = default);
    Task<int> CountTodayMenuMealsAsync(CancellationToken cancellationToken = default);
}

