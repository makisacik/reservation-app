using System.Globalization;
using Microsoft.AspNetCore.Mvc;
using ReservationApp.Application.DTOs;
using ReservationApp.Application.Interfaces;

namespace ReservationApp.API.Controllers;

[ApiController]
[Route("api/menus")]
public class MenusController : ControllerBase
{
    private readonly IMenuService _menuService;
    private readonly ILogger<MenusController> _logger;

    public MenusController(IMenuService menuService, ILogger<MenusController> logger)
    {
        _menuService = menuService;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<MenuDto>>> GetMenus(
        [FromQuery] DateTime? date,
        [FromQuery] Guid? restaurantId,
        CancellationToken cancellationToken)
    {
        _logger.LogInformation("Getting menus - Date: {Date}, RestaurantId: {RestaurantId}", date, restaurantId);

        // Convert date to UTC using Turkey timezone (UTC+3)
        DateTime? utcDate = null;
        if (date.HasValue)
        {
            // Turkey timezone
            var turkeyTz = TimeZoneInfo.FindSystemTimeZoneById("Europe/Istanbul");
            var inputDate = date.Value;

            // Treat the input date as midnight in Turkey timezone
            var turkeyDateTime = new DateTime(inputDate.Year, inputDate.Month, inputDate.Day, 0, 0, 0, DateTimeKind.Unspecified);

            // Convert from Turkey time to UTC
            utcDate = TimeZoneInfo.ConvertTimeToUtc(turkeyDateTime, turkeyTz);

            _logger.LogInformation("Date conversion - Input: {InputDate}, Turkey time: {TurkeyTime}, UTC: {UtcTime}",
                inputDate, turkeyDateTime, utcDate);
        }

        var query = new MenuQueryParams
        {
            Date = utcDate,
            RestaurantId = restaurantId
        };

        var menus = await _menuService.GetMenusAsync(query, cancellationToken);

        _logger.LogInformation("Menus returned: {MenuCount}. Date param: {Date}, RestaurantId param: {RestaurantId}",
            menus.Count(), date, restaurantId);

        return Ok(menus);
    }
}

