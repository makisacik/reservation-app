using Microsoft.AspNetCore.Mvc;
using ReservationApp.Application.DTOs;
using ReservationApp.Application.Interfaces;

namespace ReservationApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(IUserService userService, ILogger<AuthController> logger)
    {
        _userService = userService;
        _logger = logger;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(
        [FromBody] RegisterRequestDto request,
        CancellationToken cancellationToken)
    {
        _logger.LogInformation("Registration attempt for email: {Email}", request.Email);
        
        var user = await _userService.RegisterAsync(request, cancellationToken);
        _logger.LogInformation("User registered successfully. UserId: {UserId}, Email: {Email}", 
            user.Id, user.Email);
        return Ok(new { user.Email, user.Id });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(
        [FromBody] LoginRequestDto request,
        CancellationToken cancellationToken)
    {
        _logger.LogInformation("Login attempt for email: {Email}", request.Email);
        
        var response = await _userService.LoginAsync(request, cancellationToken);
        
        if (response == null)
        {
            return Unauthorized(new { message = "Invalid credentials" });
        }

        return Ok(response);
    }
}

