using ReservationApp.Domain.Entities;

namespace ReservationApp.Application.Interfaces;

public interface ISettingRepository
{
    Task<SystemSetting?> GetByKeyAsync(string key, CancellationToken cancellationToken = default);
    Task<SystemSetting?> GetByCategoryAndKeyAsync(string category, string key, CancellationToken cancellationToken = default);
    Task<IEnumerable<SystemSetting>> GetByCategoryAsync(string category, CancellationToken cancellationToken = default);
    Task<IEnumerable<SystemSetting>> GetByCategoryAndKeysAsync(string category, IEnumerable<string> keys, CancellationToken cancellationToken = default);
    Task<IEnumerable<SystemSetting>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<SystemSetting> AddAsync(SystemSetting setting, CancellationToken cancellationToken = default);
    Task UpdateAsync(SystemSetting setting, CancellationToken cancellationToken = default);
    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}

