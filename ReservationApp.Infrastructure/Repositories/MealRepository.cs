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

    public async Task SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}

