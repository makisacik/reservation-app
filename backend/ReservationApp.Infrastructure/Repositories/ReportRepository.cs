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

    public async Task<int> CountActiveUsersAsync(CancellationToken cancellationToken = default)
    {
        return await _dbContext.Users
            .Where(u => u.Status == Domain.Enums.UserStatus.Active)
            .CountAsync(cancellationToken);
    }

    public async Task<int> CountTodayMealsAsync(CancellationToken cancellationToken = default)
    {
        var today = DateTime.UtcNow.Date;
        var todayMenus = await _dbContext.Menus
            .Include(m => m.Meals)
            .Where(m => m.Date == today)
            .ToListAsync(cancellationToken);

        // Count unique meals across all today's menus
        return todayMenus
            .SelectMany(m => m.Meals)
            .Select(m => m.Id)
            .Distinct()
            .Count();
    }

    public async Task<decimal> CalculateMonthlyCostAsync(CancellationToken cancellationToken = default)
    {
        var now = DateTime.UtcNow;
        var startOfMonth = new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc);
        var endOfMonth = startOfMonth.AddMonths(1).AddDays(-1).AddHours(23).AddMinutes(59).AddSeconds(59);

        var reservationCount = await _dbContext.Reservations
            .Where(r => r.Date >= startOfMonth && r.Date <= endOfMonth && r.Status == ReservationStatus.Active)
            .CountAsync(cancellationToken);

        // Fixed price per reservation: 50 TL
        const decimal pricePerReservation = 50m;
        return reservationCount * pricePerReservation;
    }

    public async Task<IEnumerable<TodayReservationsDto>> GetTodayReservationsByTimeSlotAsync(CancellationToken cancellationToken = default)
    {
        var today = DateTime.UtcNow.Date;
        var endOfToday = today.AddDays(1).AddTicks(-1);

        var reservations = await _dbContext.Reservations
            .Include(r => r.MealTimeSlot)
            .Include(r => r.Restaurant)
            .Where(r => r.Date >= today && r.Date <= endOfToday && r.Status == ReservationStatus.Active)
            .ToListAsync(cancellationToken);

        var grouped = reservations
            .GroupBy(r => new
            {
                r.MealTimeSlotId,
                MealTimeSlotName = r.MealTimeSlot.Name,
                r.MealTimeSlot.StartTime,
                r.MealTimeSlot.EndTime,
                r.RestaurantId,
                RestaurantName = r.Restaurant.Name
            })
            .Select(g => new TodayReservationsDto
            {
                MealTimeSlotName = g.Key.MealTimeSlotName,
                StartTime = g.Key.StartTime.ToTimeSpan(),
                EndTime = g.Key.EndTime.ToTimeSpan(),
                RestaurantName = g.Key.RestaurantName,
                ReservationCount = g.Count()
            })
            .OrderBy(dto => dto.StartTime)
            .ThenBy(dto => dto.RestaurantName)
            .ToList();

        return grouped;
    }

    public async Task<IEnumerable<DailyReservationDto>> GetDailyReservationsForWeekAsync(CancellationToken cancellationToken = default)
    {
        var now = DateTime.UtcNow;
        var dayOfWeek = (int)now.DayOfWeek;
        // Convert Sunday (0) to 7 for easier calculation
        var daysFromMonday = dayOfWeek == 0 ? 6 : dayOfWeek - 1;
        var monday = now.Date.AddDays(-daysFromMonday);
        var sunday = monday.AddDays(6).AddHours(23).AddMinutes(59).AddSeconds(59);

        var reservations = await _dbContext.Reservations
            .Where(r => r.Date >= monday && r.Date <= sunday && r.Status == ReservationStatus.Active)
            .ToListAsync(cancellationToken);

        var dayNames = new[] { "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar" };
        var dayAbbreviations = new[] { "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz" };

        var dailyCounts = new List<DailyReservationDto>();

        for (int i = 0; i < 7; i++)
        {
            var date = monday.AddDays(i);
            var dayStart = date;
            var dayEnd = date.AddDays(1).AddTicks(-1);

            var count = reservations.Count(r => r.Date >= dayStart && r.Date <= dayEnd);

            dailyCounts.Add(new DailyReservationDto
            {
                DayName = dayNames[i],
                DayAbbreviation = dayAbbreviations[i],
                Date = date,
                ReservationCount = count
            });
        }

        return dailyCounts;
    }

    public async Task<int> CountReservationsPreviousPeriodAsync(CancellationToken cancellationToken = default)
    {
        var now = DateTime.UtcNow;
        var startOfCurrentMonth = new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc);
        var startOfPreviousMonth = startOfCurrentMonth.AddMonths(-1);
        var endOfPreviousMonth = startOfCurrentMonth.AddTicks(-1);

        return await _dbContext.Reservations
            .Where(r => r.Date >= startOfPreviousMonth && r.Date <= endOfPreviousMonth)
            .CountAsync(cancellationToken);
    }

    public async Task<int> CountActiveUsersPreviousPeriodAsync(CancellationToken cancellationToken = default)
    {
        var now = DateTime.UtcNow;
        var startOfCurrentMonth = new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc);
        var startOfPreviousMonth = startOfCurrentMonth.AddMonths(-1);
        var endOfPreviousMonth = startOfCurrentMonth.AddTicks(-1);

        // Count users created in previous month that are still active
        return await _dbContext.Users
            .Where(u => u.CreatedAt >= startOfPreviousMonth 
                && u.CreatedAt <= endOfPreviousMonth 
                && u.Status == Domain.Enums.UserStatus.Active)
            .CountAsync(cancellationToken);
    }

    public async Task<int> CountTodayMealsPreviousPeriodAsync(CancellationToken cancellationToken = default)
    {
        var now = DateTime.UtcNow;
        var previousDay = now.AddDays(-1).Date;

        var previousDayMenus = await _dbContext.Menus
            .Include(m => m.Meals)
            .Where(m => m.Date == previousDay)
            .ToListAsync(cancellationToken);

        return previousDayMenus
            .SelectMany(m => m.Meals)
            .Select(m => m.Id)
            .Distinct()
            .Count();
    }

    public async Task<decimal> CalculateMonthlyCostPreviousPeriodAsync(CancellationToken cancellationToken = default)
    {
        var now = DateTime.UtcNow;
        var startOfCurrentMonth = new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc);
        var startOfPreviousMonth = startOfCurrentMonth.AddMonths(-1);
        var endOfPreviousMonth = startOfCurrentMonth.AddTicks(-1);

        var reservationCount = await _dbContext.Reservations
            .Where(r => r.Date >= startOfPreviousMonth && r.Date <= endOfPreviousMonth && r.Status == ReservationStatus.Active)
            .CountAsync(cancellationToken);

        // Fixed price per reservation: 50 TL
        const decimal pricePerReservation = 50m;
        return reservationCount * pricePerReservation;
    }

    public async Task<int> CountPassiveUsersAsync(CancellationToken cancellationToken = default)
    {
        return await _dbContext.Users
            .Where(u => u.Status == Domain.Enums.UserStatus.Passive)
            .CountAsync(cancellationToken);
    }

    public async Task<int> CountNewUsersThisMonthAsync(CancellationToken cancellationToken = default)
    {
        var now = DateTime.UtcNow;
        var startOfMonth = new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc);
        var endOfMonth = startOfMonth.AddMonths(1).AddTicks(-1);

        return await _dbContext.Users
            .Where(u => u.CreatedAt >= startOfMonth && u.CreatedAt <= endOfMonth)
            .CountAsync(cancellationToken);
    }
}

