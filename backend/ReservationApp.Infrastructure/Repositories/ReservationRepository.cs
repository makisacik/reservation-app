using System.Diagnostics;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ReservationApp.Application.DTOs;
using ReservationApp.Application.Interfaces;
using ReservationApp.Domain.Entities;
using ReservationApp.Domain.Enums;
using ReservationApp.Infrastructure.Data;

namespace ReservationApp.Infrastructure.Repositories;

public class ReservationRepository : Repository<Reservation>, IReservationRepository
{
    private readonly ReservationDbContext _dbContext;
    private new readonly ILogger<ReservationRepository> _logger;

    public ReservationRepository(ReservationDbContext context, ILogger<ReservationRepository> logger) 
        : base(context, logger)
    {
        _dbContext = context;
        _logger = logger;
    }

    public async Task<PaginatedResult<Reservation>> GetPaginatedAsync(ReservationQueryParams query, CancellationToken cancellationToken = default)
    {
        var sw = Stopwatch.StartNew();
        try
        {
            var page = query.Page < 1 ? 1 : query.Page;
            var pageSize = query.PageSize < 1 ? 10 : query.PageSize;
            if (pageSize > 100) pageSize = 100;
            var q = _dbContext.Reservations
                .Include(r => r.User)
                .Include(r => r.Restaurant)
                .Include(r => r.Menu)
                    .ThenInclude(m => m.Meals)
                .Include(r => r.MealTimeSlot)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(query.Search))
            {
                q = q.Where(r => EF.Functions.ILike(r.User.Name, $"%{query.Search}%"));
            }

            if (query.Date.HasValue)
            {
                var date = query.Date.Value.Date;
                var nextDay = date.AddDays(1);
                q = q.Where(r => r.Date >= date && r.Date < nextDay);
            }
            else
            {
                if (query.From.HasValue)
                {
                    q = q.Where(r => r.Date >= query.From.Value);
                }

                if (query.To.HasValue)
                {
                    var toDate = query.To.Value.Date.AddDays(1).AddTicks(-1);
                    q = q.Where(r => r.Date <= toDate);
                }
            }

            var sortBy = string.IsNullOrWhiteSpace(query.SortBy) ? "date" : query.SortBy.ToLower();
            var sortOrder = string.IsNullOrWhiteSpace(query.SortOrder) ? "asc" : query.SortOrder.ToLower();

            q = sortBy switch
            {
                "username" => sortOrder == "desc" 
                    ? q.OrderByDescending(r => r.User.Name) 
                    : q.OrderBy(r => r.User.Name),
                "restaurantname" => sortOrder == "desc" 
                    ? q.OrderByDescending(r => r.Restaurant.Name) 
                    : q.OrderBy(r => r.Restaurant.Name),
                "createdat" => sortOrder == "desc" 
                    ? q.OrderByDescending(r => r.CreatedAt) 
                    : q.OrderBy(r => r.CreatedAt),
                _ => sortOrder == "desc" 
                    ? q.OrderByDescending(r => r.Date) 
                    : q.OrderBy(r => r.Date)
            };

            var totalCount = await q.CountAsync(cancellationToken);

            var data = await q
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync(cancellationToken);

            var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

            sw.Stop();
            _logger.LogInformation("Query GetPaginatedAsync returned {Count} reservations (Page {Page}, PageSize {PageSize}, Total {TotalCount}) in {ElapsedMs}ms", 
                data.Count, page, pageSize, totalCount, sw.ElapsedMilliseconds);

            return new PaginatedResult<Reservation>
            {
                Page = page,
                PageSize = pageSize,
                TotalCount = totalCount,
                TotalPages = totalPages,
                Data = data
            };
        }
        catch (Exception ex)
        {
            sw.Stop();
            _logger.LogError(ex, "Query GetPaginatedAsync failed after {ElapsedMs}ms", sw.ElapsedMilliseconds);
            throw;
        }
    }

    public async Task<PaginatedResult<Reservation>> GetAdminFilteredAsync(AdminReservationQueryParams query, CancellationToken cancellationToken = default)
    {
        var sw = Stopwatch.StartNew();
        try
        {
            var page = query.Page < 1 ? 1 : query.Page;
            var pageSize = query.PageSize < 1 ? 10 : query.PageSize;
            if (pageSize > 100) pageSize = 100;

            var q = _dbContext.Reservations
                .Include(r => r.User)
                .Include(r => r.Restaurant)
                .Include(r => r.Menu)
                    .ThenInclude(m => m.Meals)
                .Include(r => r.MealTimeSlot)
                .AsQueryable();

            var dateFrom = query.DateFrom.Date;
            var dateTo = query.DateTo.Date.AddDays(1).AddTicks(-1);
            q = q.Where(r => r.Date >= dateFrom && r.Date <= dateTo);

            if (query.RestaurantId.HasValue)
            {
                q = q.Where(r => r.RestaurantId == query.RestaurantId.Value);
            }

            if (!string.IsNullOrEmpty(query.Department))
            {
                var departmentLower = query.Department.ToLower();
                q = q.Where(r => r.User.Department != null && r.User.Department.ToLower().Contains(departmentLower));
            }

            if (query.Status.HasValue)
            {
                q = q.Where(r => r.Status == query.Status.Value);
            }

            if (!string.IsNullOrWhiteSpace(query.Search))
            {
                var searchTerm = query.Search.Trim();
                var searchLower = searchTerm.ToLower();
                
                string? searchGuidPart = null;
                if (searchLower.StartsWith("rez") && searchLower.Length > 3)
                {
                    var guidPart = searchLower.Substring(3).Replace("-", "").Replace(" ", "");
                    if (guidPart.Length > 0)
                    {
                        searchGuidPart = guidPart.Length > 8 ? guidPart.Substring(0, 8) : guidPart;
                    }
                }

                var finalSearchTerm = searchTerm;
                var finalSearchGuidPart = searchGuidPart;

                q = q.Where(r =>
                    EF.Functions.ILike(r.User.Name, $"%{finalSearchTerm}%") ||
                    r.Menu.Meals.Any(meal => EF.Functions.ILike(meal.Name, $"%{finalSearchTerm}%")) ||
                    (finalSearchGuidPart != null && r.Id.ToString("N").ToLower().StartsWith(finalSearchGuidPart))
                );
            }

            q = q.OrderByDescending(r => r.Date).ThenByDescending(r => r.CreatedAt);

            var totalCount = await q.CountAsync(cancellationToken);
            var data = await q
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync(cancellationToken);

            // Calculate total pages
            var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

            sw.Stop();
            _logger.LogInformation("Query GetAdminFilteredAsync returned {Count} reservations (Page {Page}, PageSize {PageSize}, Total {TotalCount}) in {ElapsedMs}ms", 
                data.Count, page, pageSize, totalCount, sw.ElapsedMilliseconds);

            return new PaginatedResult<Reservation>
            {
                Page = page,
                PageSize = pageSize,
                TotalCount = totalCount,
                TotalPages = totalPages,
                Data = data
            };
        }
        catch (Exception ex)
        {
            sw.Stop();
            _logger.LogError(ex, "Query GetAdminFilteredAsync failed after {ElapsedMs}ms", sw.ElapsedMilliseconds);
            throw;
        }
    }

    public override async Task<Reservation?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Reservations
            .Include(r => r.User)
            .Include(r => r.Restaurant)
            .Include(r => r.Menu)
                .ThenInclude(m => m.Meals)
            .Include(r => r.MealTimeSlot)
            .FirstOrDefaultAsync(r => r.Id == id, cancellationToken);
    }

    public override async Task<IEnumerable<Reservation>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _dbContext.Reservations
            .Include(r => r.User)
            .Include(r => r.Restaurant)
            .Include(r => r.Menu)
                .ThenInclude(m => m.Meals)
            .Include(r => r.MealTimeSlot)
            .OrderByDescending(r => r.Date)
            .ToListAsync(cancellationToken);
    }

    public async Task SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task<bool> HasReservationForDayAsync(Guid userId, DateOnly date, int mealTimeSlotId, CancellationToken cancellationToken = default)
    {
        var dateTime = date.ToDateTime(TimeOnly.MinValue);
        return await _dbContext.Reservations
            .AnyAsync(r => r.UserId == userId 
                && r.Date.Date == dateTime.Date 
                && r.MealTimeSlotId == mealTimeSlotId
                && (r.Status == ReservationStatus.Active || r.Status == ReservationStatus.Pending), 
                cancellationToken);
    }

    public async Task<int> CountReservationsThisWeekAsync(Guid userId, DateOnly weekStart, DateOnly weekEnd, CancellationToken cancellationToken = default)
    {
        var startDateTime = weekStart.ToDateTime(TimeOnly.MinValue);
        var endDateTime = weekEnd.ToDateTime(TimeOnly.MaxValue);
        
        return await _dbContext.Reservations
            .CountAsync(r => r.UserId == userId 
                && r.Date >= startDateTime 
                && r.Date <= endDateTime
                && r.Status == ReservationStatus.Active, 
                cancellationToken);
    }

    public async Task<IEnumerable<Reservation>> GetUserReservationsAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Reservations
            .Include(r => r.User)
            .Include(r => r.Restaurant)
            .Include(r => r.Menu)
                .ThenInclude(m => m.Meals)
            .Include(r => r.MealTimeSlot)
            .Where(r => r.UserId == userId)
            .OrderByDescending(r => r.Date)
            .ThenBy(r => r.MealTimeSlotId)
            .ToListAsync(cancellationToken);
    }

    public async Task<Reservation?> GetUserReservationByIdAsync(Guid reservationId, Guid userId, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Reservations
            .Include(r => r.User)
            .Include(r => r.Restaurant)
            .Include(r => r.Menu)
                .ThenInclude(m => m.Meals)
            .Include(r => r.MealTimeSlot)
            .FirstOrDefaultAsync(r => r.Id == reservationId && r.UserId == userId, cancellationToken);
    }

    public new async Task DeleteAsync(Reservation reservation, CancellationToken cancellationToken = default)
    {
        _dbContext.Reservations.Remove(reservation);
        await Task.CompletedTask;
    }

    public async Task<int> CountTodayReservationsAsync(CancellationToken cancellationToken = default)
    {
        var today = DateTime.UtcNow.Date;
        var tomorrow = today.AddDays(1);

        return await _dbContext.Reservations
            .CountAsync(r => r.Date >= today && r.Date < tomorrow, cancellationToken);
    }

    public async Task<int> CountThisWeekReservationsAsync(CancellationToken cancellationToken = default)
    {
        var today = DateTime.UtcNow.Date;
        var dayOfWeek = (int)today.DayOfWeek;
        var daysFromMonday = dayOfWeek == 0 ? 6 : dayOfWeek - 1;
        var weekStart = today.AddDays(-daysFromMonday);
        var weekEnd = weekStart.AddDays(7);

        return await _dbContext.Reservations
            .CountAsync(r => r.Date >= weekStart && r.Date < weekEnd, cancellationToken);
    }

    public async Task<int> CountThisMonthReservationsAsync(CancellationToken cancellationToken = default)
    {
        var today = DateTime.UtcNow.Date;
        var monthStart = new DateTime(today.Year, today.Month, 1);
        var monthEnd = monthStart.AddMonths(1);

        return await _dbContext.Reservations
            .CountAsync(r => r.Date >= monthStart && r.Date < monthEnd, cancellationToken);
    }

    public async Task<int> CountPendingReservationsAsync(CancellationToken cancellationToken = default)
    {
        return await _dbContext.Reservations
            .CountAsync(r => r.Status == ReservationStatus.Pending, cancellationToken);
    }
}

