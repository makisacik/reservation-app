using Microsoft.EntityFrameworkCore;
using ReservationApp.Application.DTOs;
using ReservationApp.Application.Interfaces;
using ReservationApp.Domain.Enums;
using ReservationApp.Infrastructure.Data;

namespace ReservationApp.Infrastructure.Repositories;

public class ReportRepository : IReportRepository
{
    private readonly ReservationDbContext _dbContext;

    public ReportRepository(ReservationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<int> CountReservationsAsync(CancellationToken cancellationToken = default)
    {
        return await _dbContext.Reservations.CountAsync(cancellationToken);
    }

    public async Task<int> CountUsersAsync(CancellationToken cancellationToken = default)
    {
        return await _dbContext.Users.CountAsync(cancellationToken);
    }

    public async Task<int> CountMealsAsync(CancellationToken cancellationToken = default)
    {
        return await _dbContext.Meals.CountAsync(cancellationToken);
    }

    public async Task<int> CountRestaurantsAsync(CancellationToken cancellationToken = default)
    {
        return await _dbContext.Restaurants.CountAsync(cancellationToken);
    }

    public async Task<IEnumerable<PopularMealDto>> GetPopularMealsAsync(int count, ReservationStatus status, CancellationToken cancellationToken = default)
    {
        // Get all reservations with their menus and meals
        var reservations = await _dbContext.Reservations
            .Include(r => r.Menu)
            .ThenInclude(m => m.Meals)
            .Where(r => r.Status == status)
            .ToListAsync(cancellationToken);

        // Count meals across all reservations
        var mealCounts = reservations
            .SelectMany(r => r.Menu.Meals)
            .GroupBy(m => new { m.Id, m.Name })
            .Select(g => new PopularMealDto
            {
                MealId = g.Key.Id,
                MealName = g.Key.Name,
                ReservationCount = g.Count()
            })
            .OrderByDescending(m => m.ReservationCount)
            .Take(count)
            .ToList();

        return mealCounts;
    }

    public async Task<IEnumerable<WeeklyTrendDto>> GetWeeklyTrendsAsync(DateTime startDate, DateTime endDate, ReservationStatus status, CancellationToken cancellationToken = default)
    {
        var reservations = await _dbContext.Reservations
            .Where(r => r.CreatedAt >= startDate && r.CreatedAt <= endDate && r.Status == status)
            .ToListAsync(cancellationToken);

        // Group by week (Monday to Sunday)
        var trends = reservations
            .GroupBy(r =>
            {
                var date = r.CreatedAt.Date;
                var dayOfWeek = (int)date.DayOfWeek;
                var daysFromMonday = dayOfWeek == 0 ? 6 : dayOfWeek - 1; // Sunday = 0, convert to Monday = 0
                return date.AddDays(-daysFromMonday); // Get Monday of the week
            })
            .Select(g => new WeeklyTrendDto
            {
                WeekStart = g.Key,
                WeekEnd = g.Key.AddDays(6),
                ReservationCount = g.Count()
            })
            .OrderBy(t => t.WeekStart)
            .ToList();

        return trends;
    }
}

