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
    private readonly ITimezoneService _timezoneService;
    private readonly ILogger<MenusController> _logger;

    public MenusController(IMenuService menuService, ITimezoneService timezoneService, ILogger<MenusController> logger)
    {
        _menuService = menuService;
        _timezoneService = timezoneService;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<MenuDto>>> GetMenus(
        [FromQuery] DateTime? date,
        [FromQuery] Guid? restaurantId,
        CancellationToken cancellationToken)
    {
        _logger.LogInformation("Getting menus - Date: {Date}, RestaurantId: {RestaurantId}", date, restaurantId);

        // Convert date to UTC using application timezone
        DateTime? utcDate = null;
        if (date.HasValue)
        {
            utcDate = await _timezoneService.ConvertToUtcAsync(date.Value, cancellationToken);
            _logger.LogInformation("Date conversion - Input: {InputDate}, UTC: {UtcTime}",
                date.Value, utcDate);
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

