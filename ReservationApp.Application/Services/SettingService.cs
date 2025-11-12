using ReservationApp.Application.Interfaces;
using ReservationApp.Domain.Enums;

namespace ReservationApp.Application.Services;

public class SettingService : ISettingService
{
    private readonly ISettingRepository _settingRepository;

    public SettingService(ISettingRepository settingRepository)
    {
        _settingRepository = settingRepository;
    }

    public async Task<int> GetMaxWeeklyReservationsAsync(CancellationToken cancellationToken = default)
    {
        return await GetSettingValueAsync("MaxWeeklyReservations", 2, cancellationToken);
    }

    public async Task<bool> GetAllowPastReservationsAsync(CancellationToken cancellationToken = default)
    {
        return await GetSettingValueAsync("AllowPastReservations", false, cancellationToken);
    }

    public async Task<bool> GetAllowSameDayReservationsAsync(CancellationToken cancellationToken = default)
    {
        return await GetSettingValueAsync("AllowSameDayReservations", false, cancellationToken);
    }

    public async Task<T> GetSettingValueAsync<T>(string key, T defaultValue, CancellationToken cancellationToken = default)
    {
        var setting = await _settingRepository.GetByKeyAsync(key, cancellationToken);
        
        if (setting == null)
        {
            return defaultValue;
        }

        try
        {
            return setting.GetValue<T>();
        }
        catch
        {
            return defaultValue;
        }
    }
}

