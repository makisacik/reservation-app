using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using ReservationApp.Application.DTOs;
using ReservationApp.Application.Interfaces;
using ReservationApp.Domain.Entities;
using ReservationApp.Domain.Enums;

namespace ReservationApp.Application.Services;

public class EmailNotificationWorker : IHostedService, IDisposable
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<EmailNotificationWorker> _logger;
    private Timer? _timer;
    private readonly SemaphoreSlim _semaphore = new(1, 1);

    public EmailNotificationWorker(
        IServiceProvider serviceProvider,
        ILogger<EmailNotificationWorker> logger)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    public Task StartAsync(CancellationToken cancellationToken)
    {
        _logger.LogInformation("Email Notification Worker is starting.");
        
        // Schedule the first run
        ScheduleNextRun();
        
        return Task.CompletedTask;
    }

    private void ScheduleNextRun()
    {
        try
        {
            using var scope = _serviceProvider.CreateScope();
            var settingService = scope.ServiceProvider.GetRequiredService<ISettingService>();
            
            // Get reminder time from settings (default to 09:00)
            var reminderTimeStr = settingService.GetValueAsync<string>("Notifications", "ReminderTime", "09:00", CancellationToken.None)
                .GetAwaiter().GetResult() ?? "09:00";
            
            if (!TimeOnly.TryParse(reminderTimeStr, out var reminderTime))
            {
                reminderTime = new TimeOnly(9, 0);
                _logger.LogWarning("Invalid ReminderTime format '{ReminderTime}', using default 09:00", reminderTimeStr);
            }

            // Get timezone from settings
            var timezoneStr = settingService.GetValueAsync<string>("General", "Timezone", "Europe/Istanbul", CancellationToken.None)
                .GetAwaiter().GetResult() ?? "Europe/Istanbul";
            
            TimeZoneInfo timeZone;
            try
            {
                timeZone = TimeZoneInfo.FindSystemTimeZoneById(timezoneStr);
            }
            catch
            {
                _logger.LogWarning("Invalid timezone '{Timezone}', using UTC", timezoneStr);
                timeZone = TimeZoneInfo.Utc;
            }

            var now = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, timeZone);
            var today = now.Date;
            var targetTime = today.Add(reminderTime.ToTimeSpan());

            // If the target time has passed today, schedule for tomorrow
            if (now >= targetTime)
            {
                targetTime = targetTime.AddDays(1);
            }

            var delay = targetTime - now;
            
            _logger.LogInformation("Next email reminder scheduled for {TargetTime} ({Delay} from now)", targetTime, delay);
            
            _timer = new Timer(async _ => await DoWorkAsync(), null, delay, Timeout.InfiniteTimeSpan);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error scheduling next email reminder run");
            // Schedule retry in 1 hour if there's an error
            _timer = new Timer(async _ => await DoWorkAsync(), null, TimeSpan.FromHours(1), Timeout.InfiniteTimeSpan);
        }
    }

    private async Task DoWorkAsync()
    {
        // Prevent concurrent executions
        if (!await _semaphore.WaitAsync(0))
        {
            _logger.LogWarning("Email reminder job is already running, skipping this execution");
            return;
        }

        try
        {
            _logger.LogInformation("Email reminder job started");

            using var scope = _serviceProvider.CreateScope();
            var settingService = scope.ServiceProvider.GetRequiredService<ISettingService>();
            var emailService = scope.ServiceProvider.GetRequiredService<IEmailNotificationService>();
            var userRepository = scope.ServiceProvider.GetRequiredService<IUserRepository>();
            var menuRepository = scope.ServiceProvider.GetRequiredService<IMenuRepository>();

            // Check if daily reminder is enabled
            var dailyReminderEnabled = await settingService.GetValueAsync<bool>("Notifications", "DailyReminderEnabled", true);
            if (!dailyReminderEnabled)
            {
                _logger.LogInformation("Daily reminder emails are disabled. Skipping job execution.");
                return;
            }

            // Get timezone
            var timezoneStr = await settingService.GetValueAsync<string>("General", "Timezone", "Europe/Istanbul") ?? "Europe/Istanbul";
            TimeZoneInfo timeZone;
            try
            {
                timeZone = TimeZoneInfo.FindSystemTimeZoneById(timezoneStr);
            }
            catch
            {
                _logger.LogWarning("Invalid timezone '{Timezone}', using UTC", timezoneStr);
                timeZone = TimeZoneInfo.Utc;
            }

            var today = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, timeZone).Date;

            // Get all active users
            var allUsers = await userRepository.GetAllAsync();
            var activeUsers = allUsers.Where(u => u.Status == UserStatus.Active).ToList();

            _logger.LogInformation("Found {Count} active users to send daily reminders", activeUsers.Count);

            // Get today's menus
            var menuQueryParams = new MenuQueryParams
            {
                Date = today
            };
            var todayMenus = await menuRepository.GetMenusAsync(menuQueryParams);
            var menusList = todayMenus.ToList();

            _logger.LogInformation("Found {Count} menus for today", menusList.Count);

            // Send emails to all active users
            var emailTasks = activeUsers.Select(async user =>
            {
                try
                {
                    await emailService.SendDailyMenuReminderAsync(user, menusList);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Failed to send daily reminder to user {UserId} ({Email})", user.Id, user.Email);
                }
            });

            await Task.WhenAll(emailTasks);
            _logger.LogInformation("Email reminder job completed successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in email reminder job");
        }
        finally
        {
            _semaphore.Release();
            // Schedule next run
            ScheduleNextRun();
        }
    }

    public Task StopAsync(CancellationToken cancellationToken)
    {
        _logger.LogInformation("Email Notification Worker is stopping.");
        _timer?.Change(Timeout.Infinite, 0);
        return Task.CompletedTask;
    }

    public void Dispose()
    {
        _timer?.Dispose();
        _semaphore?.Dispose();
    }
}

