using System.Diagnostics;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ReservationApp.Application.DTOs;
using ReservationApp.Application.Interfaces;
using ReservationApp.Domain.Entities;
using ReservationApp.Infrastructure.Data;

namespace ReservationApp.Infrastructure.Repositories;

public class UserRepository : Repository<User>, IUserRepository
{
    private readonly ReservationDbContext _dbContext;
    private new readonly ILogger<UserRepository> _logger;

    public UserRepository(ReservationDbContext context, ILogger<UserRepository> logger) 
        : base(context, logger)
    {
        _dbContext = context;
        _logger = logger;
    }

    public async Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken = default)
    {
        var sw = Stopwatch.StartNew();
        try
        {
            var result = await _dbContext.Users
                .FirstOrDefaultAsync(u => u.Email == email, cancellationToken);
            sw.Stop();
            _logger.LogInformation("Query GetByEmailAsync for email {Email} completed in {ElapsedMs}ms", 
                email, sw.ElapsedMilliseconds);
            return result;
        }
        catch (Exception ex)
        {
            sw.Stop();
            _logger.LogError(ex, "Query GetByEmailAsync for email {Email} failed after {ElapsedMs}ms", 
                email, sw.ElapsedMilliseconds);
            throw;
        }
    }

    public async Task<bool> ExistsByEmailAsync(string email, CancellationToken cancellationToken = default)
    {
        var sw = Stopwatch.StartNew();
        try
        {
            var result = await _dbContext.Users
                .AnyAsync(u => u.Email == email, cancellationToken);
            sw.Stop();
            _logger.LogInformation("Query ExistsByEmailAsync for email {Email} returned {Result} in {ElapsedMs}ms", 
                email, result, sw.ElapsedMilliseconds);
            return result;
        }
        catch (Exception ex)
        {
            sw.Stop();
            _logger.LogError(ex, "Query ExistsByEmailAsync for email {Email} failed after {ElapsedMs}ms", 
                email, sw.ElapsedMilliseconds);
            throw;
        }
    }

    public new async Task<IEnumerable<User>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _dbContext.Users.ToListAsync(cancellationToken);
    }

    public async Task<PaginatedResult<User>> GetFilteredAsync(UserFilterDto filter, CancellationToken cancellationToken = default)
    {
        var sw = Stopwatch.StartNew();
        try
        {
            var query = _dbContext.Users.AsQueryable();

            if (!string.IsNullOrEmpty(filter.Search))
            {
                var searchLower = filter.Search.ToLower();
                query = query.Where(u => u.Name.ToLower().Contains(searchLower) || u.Email.ToLower().Contains(searchLower));
            }

            if (filter.Status.HasValue)
            {
                query = query.Where(u => u.Status == filter.Status.Value);
            }

            if (filter.Role.HasValue)
            {
                query = query.Where(u => u.Role == filter.Role.Value);
            }

            if (!string.IsNullOrEmpty(filter.Department))
            {
                var departmentLower = filter.Department.ToLower();
                query = query.Where(u => u.Department != null && u.Department.ToLower().Contains(departmentLower));
            }

            query = query.OrderBy(u => u.Name);

            var totalCount = await query.CountAsync(cancellationToken);
            var skip = (filter.Page - 1) * filter.PageSize;
            var users = await query
                .Skip(skip)
                .Take(filter.PageSize)
                .ToListAsync(cancellationToken);

            var totalPages = (int)Math.Ceiling(totalCount / (double)filter.PageSize);

            sw.Stop();
            _logger.LogInformation("Query GetFilteredAsync returned {Count} users in {ElapsedMs}ms", 
                users.Count, sw.ElapsedMilliseconds);

            return new PaginatedResult<User>
            {
                Page = filter.Page,
                PageSize = filter.PageSize,
                TotalCount = totalCount,
                TotalPages = totalPages,
                Data = users
            };
        }
        catch (Exception ex)
        {
            sw.Stop();
            _logger.LogError(ex, "Query GetFilteredAsync failed after {ElapsedMs}ms", sw.ElapsedMilliseconds);
            throw;
        }
    }

    public async Task<Dictionary<Guid, int>> GetReservationCountsAsync(List<Guid> userIds, CancellationToken cancellationToken = default)
    {
        if (userIds == null || !userIds.Any())
        {
            return new Dictionary<Guid, int>();
        }

        var counts = await _dbContext.Reservations
            .Where(r => userIds.Contains(r.UserId))
            .GroupBy(r => r.UserId)
            .Select(g => new { UserId = g.Key, Count = g.Count() })
            .ToDictionaryAsync(x => x.UserId, x => x.Count, cancellationToken);

        var result = userIds.ToDictionary(id => id, id => counts.GetValueOrDefault(id, 0));
        return result;
    }

    public async Task SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}

