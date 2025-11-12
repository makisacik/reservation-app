namespace ReservationApp.Application.Interfaces;

public interface ISettingService
{
    Task<T?> GetValueAsync<T>(string category, string key, T? defaultValue = default, CancellationToken cancellationToken = default);
    Task<IDictionary<string, string>> GetByCategoryAsync(string category, CancellationToken cancellationToken = default);
    Task UpdateCategoryAsync(string category, IDictionary<string, string> values, CancellationToken cancellationToken = default);
    
    // Backward compatibility methods
    Task<int> GetMaxWeeklyReservationsAsync(CancellationToken cancellationToken = default);
    Task<bool> GetAllowPastReservationsAsync(CancellationToken cancellationToken = default);
    Task<bool> GetAllowSameDayReservationsAsync(CancellationToken cancellationToken = default);
    Task<T> GetSettingValueAsync<T>(string key, T defaultValue, CancellationToken cancellationToken = default);
}

