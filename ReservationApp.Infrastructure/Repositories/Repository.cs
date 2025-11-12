using System.Diagnostics;
using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ReservationApp.Infrastructure.Data;

namespace ReservationApp.Infrastructure.Repositories;

public class Repository<T> : IRepository<T> where T : class
{
    protected readonly ReservationDbContext _context;
    protected readonly DbSet<T> _dbSet;
    protected readonly ILogger<Repository<T>> _logger;

    public Repository(ReservationDbContext context, ILogger<Repository<T>> logger)
    {
        _context = context;
        _dbSet = context.Set<T>();
        _logger = logger;
    }

    public virtual async Task<T?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var sw = Stopwatch.StartNew();
        try
        {
            var result = await _dbSet.FindAsync(new object[] { id }, cancellationToken);
            sw.Stop();
            _logger.LogInformation("Query GetByIdAsync for {EntityType} with Id {Id} completed in {ElapsedMs}ms", 
                typeof(T).Name, id, sw.ElapsedMilliseconds);
            return result;
        }
        catch (Exception ex)
        {
            sw.Stop();
            _logger.LogError(ex, "Query GetByIdAsync for {EntityType} with Id {Id} failed after {ElapsedMs}ms", 
                typeof(T).Name, id, sw.ElapsedMilliseconds);
            throw;
        }
    }

    public virtual async Task<IEnumerable<T>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var sw = Stopwatch.StartNew();
        try
        {
            var result = await _dbSet.ToListAsync(cancellationToken);
            sw.Stop();
            _logger.LogInformation("Query GetAllAsync for {EntityType} returned {Count} items in {ElapsedMs}ms", 
                typeof(T).Name, result.Count, sw.ElapsedMilliseconds);
            return result;
        }
        catch (Exception ex)
        {
            sw.Stop();
            _logger.LogError(ex, "Query GetAllAsync for {EntityType} failed after {ElapsedMs}ms", 
                typeof(T).Name, sw.ElapsedMilliseconds);
            throw;
        }
    }

    public virtual async Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate, CancellationToken cancellationToken = default)
    {
        var sw = Stopwatch.StartNew();
        try
        {
            var result = await _dbSet.Where(predicate).ToListAsync(cancellationToken);
            sw.Stop();
            _logger.LogInformation("Query FindAsync for {EntityType} returned {Count} items in {ElapsedMs}ms", 
                typeof(T).Name, result.Count, sw.ElapsedMilliseconds);
            return result;
        }
        catch (Exception ex)
        {
            sw.Stop();
            _logger.LogError(ex, "Query FindAsync for {EntityType} failed after {ElapsedMs}ms", 
                typeof(T).Name, sw.ElapsedMilliseconds);
            throw;
        }
    }

    public virtual async Task<T> AddAsync(T entity, CancellationToken cancellationToken = default)
    {
        await _dbSet.AddAsync(entity, cancellationToken);
        return entity;
    }

    public virtual Task UpdateAsync(T entity, CancellationToken cancellationToken = default)
    {
        _dbSet.Update(entity);
        return Task.CompletedTask;
    }

    public virtual Task DeleteAsync(T entity, CancellationToken cancellationToken = default)
    {
        _dbSet.Remove(entity);
        return Task.CompletedTask;
    }

    public virtual async Task<bool> ExistsAsync(Expression<Func<T, bool>> predicate, CancellationToken cancellationToken = default)
    {
        var sw = Stopwatch.StartNew();
        try
        {
            var result = await _dbSet.AnyAsync(predicate, cancellationToken);
            sw.Stop();
            _logger.LogInformation("Query ExistsAsync for {EntityType} returned {Result} in {ElapsedMs}ms", 
                typeof(T).Name, result, sw.ElapsedMilliseconds);
            return result;
        }
        catch (Exception ex)
        {
            sw.Stop();
            _logger.LogError(ex, "Query ExistsAsync for {EntityType} failed after {ElapsedMs}ms", 
                typeof(T).Name, sw.ElapsedMilliseconds);
            throw;
        }
    }
}

