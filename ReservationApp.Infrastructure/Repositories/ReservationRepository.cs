using System.Diagnostics;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ReservationApp.Application.DTOs;
using ReservationApp.Application.Interfaces;
using ReservationApp.Domain.Entities;
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
            // Normalize pagination parameters
            var page = query.Page < 1 ? 1 : query.Page;
            var pageSize = query.PageSize < 1 ? 10 : query.PageSize;
            if (pageSize > 100) pageSize = 100; // Max page size limit

            // Start with base query
            var q = _context.Reservations
                .Include(r => r.User)
                .Include(r => r.Restaurant)
                .Include(r => r.Menu)
                .Include(r => r.MealTimeSlot)
                .AsQueryable();

            // Apply search filter (user name contains) - case-insensitive for PostgreSQL
            if (!string.IsNullOrWhiteSpace(query.Search))
            {
                q = q.Where(r => EF.Functions.ILike(r.User.Name, $"%{query.Search}%"));
            }

            // Apply date filters
            if (query.Date.HasValue)
            {
                // Exact date filter (takes precedence over range filters)
                var date = query.Date.Value.Date;
                var nextDay = date.AddDays(1);
                q = q.Where(r => r.Date >= date && r.Date < nextDay);
            }
            else
            {
                // Apply date range filters only if exact date is not specified
                if (query.From.HasValue)
                {
                    q = q.Where(r => r.Date >= query.From.Value);
                }

                if (query.To.HasValue)
                {
                    // Include the entire day for 'to' date
                    var toDate = query.To.Value.Date.AddDays(1).AddTicks(-1);
                    q = q.Where(r => r.Date <= toDate);
                }
            }

            // Apply sorting
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
                    : q.OrderBy(r => r.Date) // Default: date ascending
            };

            // Get total count before pagination
            var totalCount = await q.CountAsync(cancellationToken);

            // Apply pagination
            var data = await q
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync(cancellationToken);

            // Calculate total pages
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

    public override async Task<Reservation?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Reservations
            .Include(r => r.User)
            .Include(r => r.Restaurant)
            .Include(r => r.Menu)
            .Include(r => r.MealTimeSlot)
            .FirstOrDefaultAsync(r => r.Id == id, cancellationToken);
    }

    public override async Task<IEnumerable<Reservation>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Reservations
            .Include(r => r.User)
            .Include(r => r.Restaurant)
            .Include(r => r.Menu)
            .Include(r => r.MealTimeSlot)
            .OrderByDescending(r => r.Date)
            .ToListAsync(cancellationToken);
    }

    public async Task SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}

