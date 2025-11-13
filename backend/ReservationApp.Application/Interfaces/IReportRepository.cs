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
    Task<int> CountActiveUsersAsync(CancellationToken cancellationToken = default);
    Task<int> CountTodayMealsAsync(CancellationToken cancellationToken = default);
    Task<decimal> CalculateMonthlyCostAsync(CancellationToken cancellationToken = default);
    Task<IEnumerable<TodayReservationsDto>> GetTodayReservationsByTimeSlotAsync(CancellationToken cancellationToken = default);
    Task<IEnumerable<DailyReservationDto>> GetDailyReservationsForWeekAsync(CancellationToken cancellationToken = default);
    Task<int> CountReservationsPreviousPeriodAsync(CancellationToken cancellationToken = default);
    Task<int> CountActiveUsersPreviousPeriodAsync(CancellationToken cancellationToken = default);
    Task<int> CountTodayMealsPreviousPeriodAsync(CancellationToken cancellationToken = default);
    Task<decimal> CalculateMonthlyCostPreviousPeriodAsync(CancellationToken cancellationToken = default);
    Task<int> CountPassiveUsersAsync(CancellationToken cancellationToken = default);
    Task<int> CountNewUsersThisMonthAsync(CancellationToken cancellationToken = default);
}

