using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ReservationApp.Application.DTOs;
using ReservationApp.Application.Interfaces;

namespace ReservationApp.API.Controllers.Admin;

[ApiController]
[Route("api/admin/settings")]
[Authorize(Roles = "Admin")]
public class SettingsController : ControllerBase
{
    private readonly ISettingService _settingService;
    private readonly ILogger<SettingsController> _logger;

    // Valid keys for each category
    private static readonly HashSet<string> GeneralKeys = new() { "CompanyName", "Timezone" };
    private static readonly HashSet<string> ReservationKeys = new() 
    { 
        "MaxWeeklyReservations", 
        "MaxAdvanceReservationDays",
        "AllowPastReservations", 
        "CancellationNoticeHours", 
        "AutoApproval",
        "AllowSameDayReservations"
    };
    private static readonly HashSet<string> NotificationKeys = new() 
    { 
        "EmailEnabled", 
        "DailyReminderEnabled", 
        "ReminderTime" 
    };

    public SettingsController(ISettingService settingService, ILogger<SettingsController> logger)
    {
        _settingService = settingService;
        _logger = logger;
    }

    [HttpGet("general")]
    public async Task<ActionResult<IDictionary<string, string>>> GetGeneralSettings(CancellationToken cancellationToken)
    {
        _logger.LogInformation("Admin getting general settings");
        var settings = await _settingService.GetByCategoryAsync("General", cancellationToken);
        return Ok(settings);
    }

    [HttpPut("general")]
    public async Task<ActionResult<IDictionary<string, string>>> UpdateGeneralSettings(
        [FromBody] SettingsUpdateDto dto,
        CancellationToken cancellationToken)
    {
        _logger.LogInformation("Admin updating general settings");
        
        // Validate keys
        var invalidKeys = dto.Settings.Keys.Where(k => !GeneralKeys.Contains(k)).ToList();
        if (invalidKeys.Any())
        {
            return BadRequest(new { message = $"Invalid setting keys: {string.Join(", ", invalidKeys)}" });
        }

        await _settingService.UpdateCategoryAsync("General", dto.Settings, cancellationToken);
        var updated = await _settingService.GetByCategoryAsync("General", cancellationToken);
        return Ok(updated);
    }

    [HttpGet("reservation")]
    public async Task<ActionResult<IDictionary<string, string>>> GetReservationSettings(CancellationToken cancellationToken)
    {
        _logger.LogInformation("Admin getting reservation settings");
        var settings = await _settingService.GetByCategoryAsync("Reservation", cancellationToken);
        return Ok(settings);
    }

    [HttpPut("reservation")]
    public async Task<ActionResult<IDictionary<string, string>>> UpdateReservationSettings(
        [FromBody] SettingsUpdateDto dto,
        CancellationToken cancellationToken)
    {
        _logger.LogInformation("Admin updating reservation settings");
        
        // Validate keys
        var invalidKeys = dto.Settings.Keys.Where(k => !ReservationKeys.Contains(k)).ToList();
        if (invalidKeys.Any())
        {
            return BadRequest(new { message = $"Invalid setting keys: {string.Join(", ", invalidKeys)}" });
        }

        await _settingService.UpdateCategoryAsync("Reservation", dto.Settings, cancellationToken);
        var updated = await _settingService.GetByCategoryAsync("Reservation", cancellationToken);
        return Ok(updated);
    }

    [HttpGet("notifications")]
    public async Task<ActionResult<IDictionary<string, string>>> GetNotificationSettings(CancellationToken cancellationToken)
    {
        _logger.LogInformation("Admin getting notification settings");
        var settings = await _settingService.GetByCategoryAsync("Notifications", cancellationToken);
        return Ok(settings);
    }

    [HttpPut("notifications")]
    public async Task<ActionResult<IDictionary<string, string>>> UpdateNotificationSettings(
        [FromBody] SettingsUpdateDto dto,
        CancellationToken cancellationToken)
    {
        _logger.LogInformation("Admin updating notification settings");
        
        // Validate keys
        var invalidKeys = dto.Settings.Keys.Where(k => !NotificationKeys.Contains(k)).ToList();
        if (invalidKeys.Any())
        {
            return BadRequest(new { message = $"Invalid setting keys: {string.Join(", ", invalidKeys)}" });
        }

        // Validate ReminderTime format if present
        if (dto.Settings.TryGetValue("ReminderTime", out var reminderTime) && 
            !TimeOnly.TryParse(reminderTime, out _))
        {
            return BadRequest(new { message = "ReminderTime must be in HH:mm format" });
        }

        await _settingService.UpdateCategoryAsync("Notifications", dto.Settings, cancellationToken);
        var updated = await _settingService.GetByCategoryAsync("Notifications", cancellationToken);
        return Ok(updated);
    }
}

