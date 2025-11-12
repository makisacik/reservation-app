using Microsoft.Extensions.Caching.Memory;
using ReservationApp.Application.Interfaces;
using ReservationApp.Domain.Entities;
using ReservationApp.Domain.Enums;

namespace ReservationApp.Application.Services;

public class SettingService : ISettingService
{
    private readonly ISettingRepository _settingRepository;
    private readonly IMemoryCache _cache;
    private const int CacheExpirationMinutes = 5;

    public SettingService(ISettingRepository settingRepository, IMemoryCache cache)
    {
        _settingRepository = settingRepository;
        _cache = cache;
    }

    public async Task<T?> GetValueAsync<T>(string category, string key, T? defaultValue = default, CancellationToken cancellationToken = default)
    {
        var cacheKey = $"Setting:{category}:{key}";
        
        if (_cache.TryGetValue(cacheKey, out T? cachedValue))
        {
            return cachedValue;
        }

        var setting = await _settingRepository.GetByCategoryAndKeyAsync(category, key, cancellationToken);
        
        if (setting == null)
        {
            _cache.Set(cacheKey, defaultValue, TimeSpan.FromMinutes(CacheExpirationMinutes));
            return defaultValue;
        }

        try
        {
            // Handle nullable value types by extracting underlying type
            var underlyingType = Nullable.GetUnderlyingType(typeof(T));
            if (underlyingType != null)
            {
                // For nullable types, call GetValue with the underlying type
                var method = typeof(SystemSetting).GetMethod("GetValue")!
                    .MakeGenericMethod(underlyingType);
                var nonNullableValue = method.Invoke(setting, null);
                var nullableValue = Activator.CreateInstance(typeof(T), nonNullableValue);
                _cache.Set(cacheKey, nullableValue, TimeSpan.FromMinutes(CacheExpirationMinutes));
                return (T)nullableValue!;
            }
            else
            {
                var value = setting.GetValue<T>();
                _cache.Set(cacheKey, value, TimeSpan.FromMinutes(CacheExpirationMinutes));
                return value;
            }
        }
        catch
        {
            _cache.Set(cacheKey, defaultValue, TimeSpan.FromMinutes(CacheExpirationMinutes));
            return defaultValue;
        }
    }

    public async Task<IDictionary<string, string>> GetByCategoryAsync(string category, CancellationToken cancellationToken = default)
    {
        var cacheKey = $"Settings:Category:{category}";
        
        if (_cache.TryGetValue(cacheKey, out IDictionary<string, string>? cachedSettings))
        {
            return cachedSettings!;
        }

        var settings = await _settingRepository.GetByCategoryAsync(category, cancellationToken);
        var result = settings.ToDictionary(s => s.Key, s => s.Value);
        
        _cache.Set(cacheKey, result, TimeSpan.FromMinutes(CacheExpirationMinutes));
        return result;
    }

    public async Task UpdateCategoryAsync(string category, IDictionary<string, string> values, CancellationToken cancellationToken = default)
    {
        var existingSettings = await _settingRepository.GetByCategoryAndKeysAsync(category, values.Keys, cancellationToken);
        var existingDict = existingSettings.ToDictionary(s => s.Key, s => s);

        foreach (var kvp in values)
        {
            if (existingDict.TryGetValue(kvp.Key, out var existingSetting))
            {
                // Update existing setting
                existingSetting.UpdateValue(kvp.Value);
                await _settingRepository.UpdateAsync(existingSetting, cancellationToken);
            }
            else
            {
                // Create new setting (default to String type if we can't determine)
                var settingType = DetermineSettingType(kvp.Value);
                var newSetting = new SystemSetting(category, kvp.Key, kvp.Value, settingType);
                await _settingRepository.AddAsync(newSetting, cancellationToken);
            }
        }

        await _settingRepository.SaveChangesAsync(cancellationToken);

        // Invalidate cache for this category
        _cache.Remove($"Settings:Category:{category}");
        
        // Invalidate individual setting caches
        foreach (var key in values.Keys)
        {
            _cache.Remove($"Setting:{category}:{key}");
        }
    }

    private static SettingType DetermineSettingType(string value)
    {
        if (bool.TryParse(value, out _))
            return SettingType.Bool;
        if (int.TryParse(value, out _))
            return SettingType.Int;
        return SettingType.String;
    }

    // Backward compatibility methods
    public async Task<int> GetMaxWeeklyReservationsAsync(CancellationToken cancellationToken = default)
    {
        var result = await GetValueAsync<int?>("Reservation", "MaxWeeklyReservations", null, cancellationToken);
        return result ?? 2;
    }

    public async Task<bool> GetAllowPastReservationsAsync(CancellationToken cancellationToken = default)
    {
        var result = await GetValueAsync<bool?>("Reservation", "AllowPastReservations", null, cancellationToken);
        return result ?? false;
    }

    public async Task<bool> GetAllowSameDayReservationsAsync(CancellationToken cancellationToken = default)
    {
        var result = await GetValueAsync<bool?>("Reservation", "AllowSameDayReservations", null, cancellationToken);
        return result ?? false;
    }

    public async Task<T> GetSettingValueAsync<T>(string key, T defaultValue, CancellationToken cancellationToken = default)
    {
        // Try to find in any category (backward compatibility)
        var allSettings = await _settingRepository.GetAllAsync(cancellationToken);
        var setting = allSettings.FirstOrDefault(s => s.Key == key);
        
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

