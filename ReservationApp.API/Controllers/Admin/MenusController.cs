using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ReservationApp.Application.DTOs;
using ReservationApp.Application.Interfaces;

namespace ReservationApp.API.Controllers.Admin;

[ApiController]
[Route("api/admin/menus")]
[Authorize(Roles = "Admin")]
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
        [FromQuery] MenuQueryParams query,
        CancellationToken cancellationToken)
    {
        _logger.LogInformation("Admin getting menus - RestaurantId: {RestaurantId}, Date: {Date}", 
            query.RestaurantId, query.Date);
        
        var menus = await _menuService.GetMenusAsync(query, cancellationToken);
        return Ok(menus);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<MenuDto>> GetMenu(Guid id, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Admin getting menu with id: {Id}", id);
        var menu = await _menuService.GetByIdAsync(id, cancellationToken);
        return Ok(menu);
    }

    [HttpPost]
    public async Task<ActionResult<MenuDto>> CreateMenu(
        [FromBody] MenuCreateDto dto,
        CancellationToken cancellationToken)
    {
        _logger.LogInformation("Admin creating menu - RestaurantId: {RestaurantId}, Date: {Date}, MenuType: {MenuType}", 
            dto.RestaurantId, dto.Date, dto.MenuType);
        
        var menu = await _menuService.CreateAsync(dto, cancellationToken);
        return CreatedAtAction(nameof(GetMenu), new { id = menu.Id }, menu);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<MenuDto>> UpdateMenu(
        Guid id,
        [FromBody] MenuUpdateDto dto,
        CancellationToken cancellationToken)
    {
        _logger.LogInformation("Admin updating menu with id: {Id}", id);
        var menu = await _menuService.UpdateAsync(id, dto, cancellationToken);
        return Ok(menu);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteMenu(Guid id, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Admin deleting menu with id: {Id}", id);
        await _menuService.DeleteAsync(id, cancellationToken);
        return NoContent();
    }
}

