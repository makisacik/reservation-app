using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ReservationApp.Application.DTOs;
using ReservationApp.Application.Interfaces;
using ReservationApp.Domain.Entities;
using ReservationApp.Infrastructure.Data;

namespace ReservationApp.Infrastructure.Repositories;

public class MenuRepository : Repository<Menu>, IMenuRepository
{
    private readonly ReservationDbContext _dbContext;
    private new readonly ILogger<MenuRepository> _logger;

    public MenuRepository(ReservationDbContext context, ILogger<MenuRepository> logger)
        : base(context, logger)
    {
        _dbContext = context;
        _logger = logger;
    }

    public new async Task<Menu?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Menus
            .Include(m => m.Restaurant)
            .Include(m => m.Meals)
                .ThenInclude(meal => meal.Category)
            .Include(m => m.Meals)
                .ThenInclude(meal => meal.Restaurant)
            .FirstOrDefaultAsync(m => m.Id == id, cancellationToken);
    }

    public async Task<IEnumerable<Menu>> GetMenusAsync(MenuQueryParams query, CancellationToken cancellationToken = default)
    {
        var q = _dbContext.Menus
            .Include(m => m.Restaurant)
            .Include(m => m.Meals)
                .ThenInclude(meal => meal.Category)
            .Include(m => m.Meals)
                .ThenInclude(meal => meal.Restaurant)
            .AsQueryable();

        if (query.RestaurantId.HasValue)
        {
            q = q.Where(m => m.RestaurantId == query.RestaurantId.Value);
        }

        if (query.Date.HasValue)
        {
            var date = query.Date.Value.Date;
            var nextDay = date.AddDays(1);
            q = q.Where(m => m.Date >= date && m.Date < nextDay);
        }

        q = q.OrderBy(m => m.Date).ThenBy(m => m.RestaurantId);

        return await q.ToListAsync(cancellationToken);
    }

    public new async Task UpdateAsync(Menu menu, CancellationToken cancellationToken = default)
    {
        await base.UpdateAsync(menu, cancellationToken);
    }

    public new async Task DeleteAsync(Menu menu, CancellationToken cancellationToken = default)
    {
        await base.DeleteAsync(menu, cancellationToken);
    }

    public async Task SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}

