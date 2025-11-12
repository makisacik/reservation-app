using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ReservationApp.Application.Interfaces;
using ReservationApp.Domain.Entities;
using ReservationApp.Infrastructure.Data;

namespace ReservationApp.Infrastructure.Repositories;

public class MealRepository : Repository<Meal>, IMealRepository
{
    private readonly ReservationDbContext _dbContext;
    private new readonly ILogger<MealRepository> _logger;

    public MealRepository(ReservationDbContext context, ILogger<MealRepository> logger)
        : base(context, logger)
    {
        _dbContext = context;
        _logger = logger;
    }

    public new async Task<Meal?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Meals
            .Include(m => m.Category)
            .Include(m => m.Restaurant)
            .FirstOrDefaultAsync(m => m.Id == id, cancellationToken);
    }

    public async Task<IEnumerable<Meal>> GetAllAsync(Guid? restaurantId = null, Guid? categoryId = null, CancellationToken cancellationToken = default)
    {
        var q = _dbContext.Meals
            .Include(m => m.Category)
            .Include(m => m.Restaurant)
            .AsQueryable();

        if (restaurantId.HasValue)
        {
            q = q.Where(m => m.RestaurantId == restaurantId.Value);
        }

        if (categoryId.HasValue)
        {
            q = q.Where(m => m.CategoryId == categoryId.Value);
        }

        q = q.OrderBy(m => m.Name);

        return await q.ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Meal>> GetByIdsAsync(IEnumerable<Guid> ids, CancellationToken cancellationToken = default)
    {
        var idList = ids.ToList();
        return await _dbContext.Meals
            .Include(m => m.Category)
            .Include(m => m.Restaurant)
            .Where(m => idList.Contains(m.Id))
            .ToListAsync(cancellationToken);
    }

    public async Task<bool> CategoryExistsAsync(Guid categoryId, CancellationToken cancellationToken = default)
    {
        return await _dbContext.MenuCategories
            .AnyAsync(c => c.Id == categoryId, cancellationToken);
    }

    public new async Task UpdateAsync(Meal meal, CancellationToken cancellationToken = default)
    {
        await base.UpdateAsync(meal, cancellationToken);
    }

    public new async Task DeleteAsync(Meal meal, CancellationToken cancellationToken = default)
    {
        await base.DeleteAsync(meal, cancellationToken);
    }

    public async Task SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}

