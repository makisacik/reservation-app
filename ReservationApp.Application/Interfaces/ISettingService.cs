namespace ReservationApp.Application.Interfaces;

public interface ISettingService
{
    Task<int> GetMaxWeeklyReservationsAsync(CancellationToken cancellationToken = default);
    Task<bool> GetAllowPastReservationsAsync(CancellationToken cancellationToken = default);
    Task<bool> GetAllowSameDayReservationsAsync(CancellationToken cancellationToken = default);
    Task<T> GetSettingValueAsync<T>(string key, T defaultValue, CancellationToken cancellationToken = default);
}

