using Microsoft.AspNetCore.Mvc;
using ReservationApp.Application.DTOs;
using ReservationApp.Application.Interfaces;

namespace ReservationApp.API.Controllers;

[ApiController]
[Route("api/reservations")]
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
    public async Task<ActionResult<PaginatedResult<ReservationDto>>> GetReservations(
        [FromQuery] ReservationQueryParams query,
        CancellationToken cancellationToken)
    {
        _logger.LogInformation("Getting reservations with pagination - Page: {Page}, PageSize: {PageSize}, Search: {Search}, SortBy: {SortBy}", 
            query.Page, query.PageSize, query.Search, query.SortBy);
        
        var result = await _reservationService.GetReservationsAsync(query, cancellationToken);
        return Ok(result);
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
        _logger.LogInformation("Creating reservation");
        var reservation = await _reservationService.CreateReservationAsync(createReservationDto, cancellationToken);
        _logger.LogInformation("Reservation created successfully. ReservationId: {ReservationId}, UserId: {UserId}, Date: {Date}", 
            reservation.Id, reservation.UserId, reservation.Date);
        return CreatedAtAction(nameof(GetReservation), new { id = reservation.Id }, reservation);
    }
}

