using System.Globalization;
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
        _logger.LogInformation("=== CONTROLLER: CreateReservation START ===");
        _logger.LogInformation("Controller - Received DTO: RestaurantId={RestaurantId}, MenuId={MenuId}, MealTimeSlotId={MealTimeSlotId}, Date={Date}, Appetizer={Appetizer}",
            createReservationDto.RestaurantId, createReservationDto.MenuId, createReservationDto.MealTimeSlotId, 
            createReservationDto.Date, createReservationDto.Appetizer);
        
        var userId = GetUserIdFromClaims();
        if (userId == null)
        {
            _logger.LogWarning("Controller - Unauthorized: Invalid token");
            return Unauthorized(new { message = "Invalid token" });
        }

        _logger.LogInformation("Controller - UserId: {UserId}", userId);

        // Convert date to UTC for PostgreSQL compatibility
        // PostgreSQL requires DateTime with Kind=Utc for timestamp with time zone columns
        var inputDate = createReservationDto.Date;
        _logger.LogInformation("Controller - Input Date Analysis: Value={Value}, Kind={Kind}, Ticks={Ticks}, Year={Year}, Month={Month}, Day={Day}, Hour={Hour}, Minute={Minute}, Second={Second}",
            inputDate, inputDate.Kind, inputDate.Ticks, inputDate.Year, inputDate.Month, inputDate.Day, 
            inputDate.Hour, inputDate.Minute, inputDate.Second);
        
        // Ensure the DateTime is in UTC with Kind=Utc
        if (inputDate.Kind == DateTimeKind.Unspecified)
        {
            _logger.LogInformation("Controller - Date is Unspecified, converting from Turkey timezone to UTC");
            // Frontend sends dates as "YYYY-MM-DDTHH:mm:ss" without timezone
            // Treat it as midnight in Turkey timezone (Europe/Istanbul) and convert to UTC
            var turkeyTz = TimeZoneInfo.FindSystemTimeZoneById("Europe/Istanbul");
            // Create DateTimeOffset in Turkey timezone
            var turkeyDateTimeOffset = new DateTimeOffset(
                inputDate.Year, 
                inputDate.Month, 
                inputDate.Day, 
                inputDate.Hour, 
                inputDate.Minute, 
                inputDate.Second, 
                turkeyTz.GetUtcOffset(DateTimeOffset.UtcNow));
            // Convert to UTC and get DateTime with Kind=Utc
            createReservationDto.Date = turkeyDateTimeOffset.UtcDateTime;
            
            _logger.LogInformation("Controller - Date conversion: Input={InputDate}, Turkey time={TurkeyTime}, UTC={UtcTime}, UTC Kind={UtcKind}",
                inputDate, turkeyDateTimeOffset.DateTime, createReservationDto.Date, createReservationDto.Date.Kind);
        }
        else if (inputDate.Kind == DateTimeKind.Local)
        {
            _logger.LogInformation("Controller - Date is Local, converting to UTC");
            // If it's already local, convert to UTC
            createReservationDto.Date = inputDate.ToUniversalTime();
            _logger.LogInformation("Controller - Date converted: Original={OriginalDate}, UTC={UtcDate}, UTC Kind={UtcKind}",
                inputDate, createReservationDto.Date, createReservationDto.Date.Kind);
        }
        else if (inputDate.Kind == DateTimeKind.Utc)
        {
            _logger.LogInformation("Controller - Date is already UTC, ensuring explicit UTC kind");
            // Already UTC, ensure it's explicitly marked as UTC
            createReservationDto.Date = DateTime.SpecifyKind(inputDate, DateTimeKind.Utc);
            _logger.LogInformation("Controller - Date specified as UTC: Value={Value}, Kind={Kind}",
                createReservationDto.Date, createReservationDto.Date.Kind);
        }

        _logger.LogInformation("Controller - Final DTO before service call: Date={Date}, Date Kind={DateKind}",
            createReservationDto.Date, createReservationDto.Date.Kind);
        
        _logger.LogInformation("Controller - Calling service.CreateAsync...");
        var reservation = await _reservationService.CreateAsync(createReservationDto, userId.Value, cancellationToken);
        
        _logger.LogInformation("Controller - Service returned: ReservationId={ReservationId}, Date={Date}, Date Kind={DateKind}",
            reservation.Id, reservation.Date, reservation.Date.Kind);
        _logger.LogInformation("=== CONTROLLER: CreateReservation SUCCESS ===");
        
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

