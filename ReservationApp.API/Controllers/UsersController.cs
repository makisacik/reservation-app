using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ReservationApp.Application.DTOs;
using ReservationApp.Application.Interfaces;

namespace ReservationApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly ILogger<UsersController> _logger;

    public UsersController(IUserService userService, ILogger<UsersController> logger)
    {
        _userService = userService;
        _logger = logger;
    }

    [HttpGet("me")]
    public async Task<IActionResult> GetCurrentUser(CancellationToken cancellationToken)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier) 
            ?? User.FindFirstValue(JwtRegisteredClaimNames.Sub);
        
        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
        {
            _logger.LogWarning("Invalid user ID claim in token");
            return Unauthorized(new { message = "Invalid token" });
        }

        _logger.LogInformation("Fetching user profile for ID: {UserId}", userId);
        
        var user = await _userService.GetUserByIdAsync(userId, cancellationToken);
        return Ok(user);
    }

    [HttpGet]
    [Authorize(Policy = "AdminOnly")]
    public async Task<IActionResult> GetAllUsers(CancellationToken cancellationToken)
    {
        _logger.LogInformation("Admin fetching all users");
        var users = await _userService.GetAllUsersAsync(cancellationToken);
        return Ok(users);
    }

    [HttpPut("{id}/role")]
    [Authorize(Policy = "AdminOnly")]
    public async Task<IActionResult> UpdateUserRole(
        Guid id,
        [FromBody] UpdateUserRoleDto request,
        CancellationToken cancellationToken)
    {
        _logger.LogInformation("Admin updating role for user ID: {UserId}", id);
        
        var user = await _userService.UpdateUserRoleAsync(id, request.Role, cancellationToken);
        return Ok(user);
    }
}

