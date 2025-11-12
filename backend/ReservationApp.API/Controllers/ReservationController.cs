using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ReservationApp.Application.DTOs;
using ReservationApp.Application.Interfaces;

namespace ReservationApp.API.Controllers;

[ApiController]
[Route("api/reservations")]
[Authorize]
public class ReservationController : ControllerBase
{
    private readonly IReservationService _reservationService;
    private readonly ILogger<ReservationController> _logger;

    public ReservationController(IReservationService reservationService, ILogger<ReservationController> logger)
    {
        _reservationService = reservationService;
        _logger = logger;
    }

    [HttpGet]
    [Authorize(Policy = "AdminOnly")]
    public async Task<ActionResult<PaginatedResult<ReservationDto>>> GetReservations(
        [FromQuery] ReservationQueryParams query,
        CancellationToken cancellationToken)
    {
        _logger.LogInformation("Admin getting reservations with pagination - Page: {Page}, PageSize: {PageSize}, Search: {Search}, SortBy: {SortBy}", 
            query.Page, query.PageSize, query.Search, query.SortBy);
        
        var result = await _reservationService.GetReservationsAsync(query, cancellationToken);
        return Ok(result);
    }

    [HttpGet("my")]
    public async Task<ActionResult<IEnumerable<ReservationDto>>> GetMyReservations(CancellationToken cancellationToken)
    {
        var userId = GetUserIdFromClaims();
        if (userId == null)
        {
            return Unauthorized(new { message = "Invalid token" });
        }

        _logger.LogInformation("Getting reservations for user ID: {UserId}", userId);
        var reservations = await _reservationService.GetMyReservationsAsync(userId.Value, cancellationToken);
        return Ok(reservations);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ReservationDto>> GetReservation(Guid id, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Getting reservation with id: {Id}", id);
        var reservation = await _reservationService.GetReservationByIdAsync(id, cancellationToken);
        return Ok(reservation);
    }

    [HttpPost]
    public async Task<ActionResult<ReservationDto>> CreateReservation(
        [FromBody] CreateReservationDto createReservationDto,
        CancellationToken cancellationToken)
    {
        var userId = GetUserIdFromClaims();
        if (userId == null)
        {
            return Unauthorized(new { message = "Invalid token" });
        }

        _logger.LogInformation("Creating reservation for user ID: {UserId}", userId);
        var reservation = await _reservationService.CreateAsync(createReservationDto, userId.Value, cancellationToken);
        _logger.LogInformation("Reservation created successfully. ReservationId: {ReservationId}, UserId: {UserId}, Date: {Date}", 
            reservation.Id, reservation.UserId, reservation.Date);
        return CreatedAtAction(nameof(GetReservation), new { id = reservation.Id }, reservation);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> CancelReservation(Guid id, CancellationToken cancellationToken)
    {
        var userId = GetUserIdFromClaims();
        if (userId == null)
        {
            return Unauthorized(new { message = "Invalid token" });
        }

        _logger.LogInformation("Cancelling reservation {ReservationId} for user ID: {UserId}", id, userId);
        await _reservationService.CancelAsync(id, userId.Value, cancellationToken);
        _logger.LogInformation("Reservation {ReservationId} cancelled successfully", id);
        return NoContent();
    }

    private Guid? GetUserIdFromClaims()
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier) 
            ?? User.FindFirstValue(JwtRegisteredClaimNames.Sub);
        
        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
        {
            _logger.LogWarning("Invalid user ID claim in token");
            return null;
        }

        return userId;
    }
}

