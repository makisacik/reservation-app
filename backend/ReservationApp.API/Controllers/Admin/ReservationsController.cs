using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ReservationApp.Application.DTOs;
using ReservationApp.Application.Interfaces;

namespace ReservationApp.API.Controllers.Admin;

[ApiController]
[Route("api/admin/reservations")]
[Authorize(Roles = "Admin")]
public class ReservationsController : ControllerBase
{
    private readonly IReservationService _reservationService;
    private readonly ILogger<ReservationsController> _logger;

    public ReservationsController(IReservationService reservationService, ILogger<ReservationsController> logger)
    {
        _reservationService = reservationService;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<PaginatedResult<ReservationDto>>> GetReservations(
        [FromQuery] AdminReservationQueryParams query,
        CancellationToken cancellationToken)
    {
        _logger.LogInformation("Admin getting reservations with filters - Page: {Page}, PageSize: {PageSize}, DateFrom: {DateFrom}, DateTo: {DateTo}, RestaurantId: {RestaurantId}, Status: {Status}", 
            query.Page, query.PageSize, query.DateFrom, query.DateTo, query.RestaurantId, query.Status);
        
        var result = await _reservationService.GetAdminFilteredAsync(query, cancellationToken);
        return Ok(result);
    }

    [HttpPut("{id}/cancel")]
    public async Task<IActionResult> CancelReservation(Guid id, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Admin cancelling reservation with id: {Id}", id);
        await _reservationService.AdminCancelAsync(id, cancellationToken);
        return NoContent();
    }

    [HttpPut("{id}/approve")]
    public async Task<IActionResult> ApproveReservation(Guid id, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Admin approving reservation with id: {Id}", id);
        await _reservationService.AdminApproveAsync(id, cancellationToken);
        return NoContent();
    }

    [HttpGet("summary")]
    public async Task<ActionResult<ReservationSummaryDto>> GetReservationSummary(CancellationToken cancellationToken)
    {
        _logger.LogInformation("Admin getting reservation summary");
        var summary = await _reservationService.GetReservationSummaryAsync(cancellationToken);
        return Ok(summary);
    }

    [HttpPost]
    public async Task<ActionResult<ReservationDto>> CreateReservation(
        [FromBody] AdminCreateReservationDto dto,
        CancellationToken cancellationToken)
    {
        _logger.LogInformation("Admin creating reservation - UserId: {UserId}, RestaurantId: {RestaurantId}, MenuId: {MenuId}, MealTimeSlotId: {MealTimeSlotId}, Date: {Date}",
            dto.UserId, dto.RestaurantId, dto.MenuId, dto.MealTimeSlotId, dto.Date);
        
        var reservation = await _reservationService.AdminCreateAsync(dto, cancellationToken);
        return CreatedAtAction(nameof(GetReservations), new { id = reservation.Id }, reservation);
    }
}

