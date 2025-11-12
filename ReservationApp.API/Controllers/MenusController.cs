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
        
        var query = new MenuQueryParams
        {
            Date = date,
            RestaurantId = restaurantId
        };
        
        var menus = await _menuService.GetMenusAsync(query, cancellationToken);
        return Ok(menus);
    }
}

