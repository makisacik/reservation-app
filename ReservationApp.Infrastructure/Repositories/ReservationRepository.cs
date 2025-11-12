using Microsoft.EntityFrameworkCore;
using ReservationApp.Application.DTOs;
using ReservationApp.Application.Interfaces;
using ReservationApp.Domain.Entities;
using ReservationApp.Infrastructure.Data;

namespace ReservationApp.Infrastructure.Repositories;

public class ReservationRepository : Repository<Reservation>, IReservationRepository
{
    private readonly ReservationDbContext _dbContext;

    public ReservationRepository(ReservationDbContext context) : base(context)
    {
        _dbContext = context;
    }

    public async Task<PaginatedResult<Reservation>> GetPaginatedAsync(ReservationQueryParams query, CancellationToken cancellationToken = default)
    {
        // Normalize pagination parameters
        var page = query.Page < 1 ? 1 : query.Page;
        var pageSize = query.PageSize < 1 ? 10 : query.PageSize;
        if (pageSize > 100) pageSize = 100; // Max page size limit

        // Start with base query
        var q = _context.Reservations.AsQueryable();

        // Apply search filter (customer name contains) - case-insensitive for PostgreSQL
        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            q = q.Where(r => EF.Functions.ILike(r.CustomerName, $"%{query.Search}%"));
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
            "customername" => sortOrder == "desc" 
                ? q.OrderByDescending(r => r.CustomerName) 
                : q.OrderBy(r => r.CustomerName),
            "guests" => sortOrder == "desc" 
                ? q.OrderByDescending(r => r.Guests) 
                : q.OrderBy(r => r.Guests),
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

        return new PaginatedResult<Reservation>
        {
            Page = page,
            PageSize = pageSize,
            TotalCount = totalCount,
            TotalPages = totalPages,
            Data = data
        };
    }

    public async Task SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}

