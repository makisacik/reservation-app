using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ReservationApp.Application.Interfaces;
using ReservationApp.Domain.Entities;
using ReservationApp.Infrastructure.Data;

namespace ReservationApp.Infrastructure.Repositories;

public class MenuCategoryRepository : Repository<MenuCategory>, IMenuCategoryRepository
{
    private readonly ReservationDbContext _dbContext;
    private new readonly ILogger<MenuCategoryRepository> _logger;

    public MenuCategoryRepository(ReservationDbContext context, ILogger<MenuCategoryRepository> logger)
        : base(context, logger)
    {
        _dbContext = context;
        _logger = logger;
    }

    public new async Task<IEnumerable<MenuCategory>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _dbContext.MenuCategories
            .OrderBy(c => c.Name)
            .ToListAsync(cancellationToken);
    }

    public new async Task<MenuCategory?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _dbContext.MenuCategories
            .FirstOrDefaultAsync(c => c.Id == id, cancellationToken);
    }

    public async Task<MenuCategory?> GetByNameAsync(string name, CancellationToken cancellationToken = default)
    {
        return await _dbContext.MenuCategories
            .FirstOrDefaultAsync(c => c.Name == name, cancellationToken);
    }
}

