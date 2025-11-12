using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ReservationApp.Application.Interfaces;
using ReservationApp.Domain.Entities;
using ReservationApp.Infrastructure.Data;

namespace ReservationApp.Infrastructure.Repositories;

public class SettingRepository : ISettingRepository
{
    private readonly ReservationDbContext _dbContext;
    private readonly ILogger<SettingRepository> _logger;

    public SettingRepository(ReservationDbContext context, ILogger<SettingRepository> logger)
    {
        _dbContext = context;
        _logger = logger;
    }

    public async Task<SystemSetting?> GetByKeyAsync(string key, CancellationToken cancellationToken = default)
    {
        return await _dbContext.SystemSettings
            .FirstOrDefaultAsync(s => s.Key == key, cancellationToken);
    }

    public async Task<IEnumerable<SystemSetting>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _dbContext.SystemSettings
            .OrderBy(s => s.Key)
            .ToListAsync(cancellationToken);
    }

    public async Task<SystemSetting> AddAsync(SystemSetting setting, CancellationToken cancellationToken = default)
    {
        await _dbContext.SystemSettings.AddAsync(setting, cancellationToken);
        return setting;
    }

    public async Task SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}

