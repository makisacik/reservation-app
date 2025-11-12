using System.Diagnostics;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
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

    public async Task SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}

