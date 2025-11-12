using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ReservationApp.Application.DTOs;
using ReservationApp.Application.Interfaces;

namespace ReservationApp.API.Controllers.Admin;

[ApiController]
[Route("api/admin/users")]
[Authorize(Roles = "Admin")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly ILogger<UsersController> _logger;

    public UsersController(IUserService userService, ILogger<UsersController> logger)
    {
        _userService = userService;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<PaginatedResult<UserDto>>> GetUsers(
        [FromQuery] UserFilterDto filter,
        CancellationToken cancellationToken)
    {
        _logger.LogInformation("Admin getting users with filters - Page: {Page}, PageSize: {PageSize}, Search: {Search}, Status: {Status}, Role: {Role}", 
            filter.Page, filter.PageSize, filter.Search, filter.Status, filter.Role);
        
        var result = await _userService.GetFilteredAsync(filter, cancellationToken);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<UserDto>> GetUser(Guid id, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Admin getting user with id: {Id}", id);
        var user = await _userService.GetUserByIdAsync(id, cancellationToken);
        return Ok(user);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<UserDto>> UpdateUser(
        Guid id,
        [FromBody] UserUpdateDto dto,
        CancellationToken cancellationToken)
    {
        _logger.LogInformation("Admin updating user with id: {Id}", id);
        var user = await _userService.UpdateAsync(id, dto, cancellationToken);
        return Ok(user);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(Guid id, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Admin deleting (soft delete) user with id: {Id}", id);
        await _userService.ToggleStatusAsync(id, cancellationToken);
        return NoContent();
    }
}

