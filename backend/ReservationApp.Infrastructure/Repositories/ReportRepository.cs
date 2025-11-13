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

    public async Task<int> CountMealsByCategoryNameAsync(string categoryName, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Meals
            .Include(m => m.Category)
            .Where(m => m.Category.Name == categoryName)
            .CountAsync(cancellationToken);
    }

    public async Task<string> GetMostPopularMealNameAsync(CancellationToken cancellationToken = default)
    {
        // Get the most popular meal from ACTUAL RESERVATIONS only
        // This ensures the stat is calculated from real reservation data, not hardcoded or seeded
        var popularMeals = await GetPopularMealsAsync(1, ReservationStatus.Active, cancellationToken);
        var mostPopular = popularMeals.FirstOrDefault();
        
        if (mostPopular != null)
        {
            // Return first word of meal name (e.g., "Izgara" from "Izgara Köfte")
            return mostPopular.MealName.Split(' ')[0];
        }

        // If no reservations exist, return empty string
        // The stat should only show data from actual reservations, not fallback to menus or meals
        return string.Empty;
    }

    public async Task<int> CountTodayMenuMealsAsync(CancellationToken cancellationToken = default)
    {
        var today = DateTime.UtcNow.Date;
        var todayMenus = await _dbContext.Menus
            .Include(m => m.Meals)
            .Where(m => m.Date == today)
            .ToListAsync(cancellationToken);

        // Count unique meals across all today's menus
        var uniqueMealIds = todayMenus
            .SelectMany(m => m.Meals)
            .Select(m => m.Id)
            .Distinct()
            .Count();

        return uniqueMealIds;
    }
}

