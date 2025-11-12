using ReservationApp.Application.DTOs;
using ReservationApp.Application.Interfaces;
using ReservationApp.Domain.Entities;
using ReservationApp.Domain.Exceptions;

namespace ReservationApp.Application.Services;

public class ReservationService : IReservationService
{
    private readonly IReservationRepository _reservationRepository;

    public ReservationService(IReservationRepository reservationRepository)
    {
        _reservationRepository = reservationRepository;
    }

    public async Task<IEnumerable<ReservationDto>> GetAllReservationsAsync(CancellationToken cancellationToken = default)
    {
        var reservations = await _reservationRepository.GetAllAsync(cancellationToken);
        return reservations.Select(MapToDto);
    }

    public async Task<PaginatedResult<ReservationDto>> GetReservationsAsync(ReservationQueryParams query, CancellationToken cancellationToken = default)
    {
        var paginatedResult = await _reservationRepository.GetPaginatedAsync(query, cancellationToken);
        
        return new PaginatedResult<ReservationDto>
        {
            Page = paginatedResult.Page,
            PageSize = paginatedResult.PageSize,
            TotalCount = paginatedResult.TotalCount,
            TotalPages = paginatedResult.TotalPages,
            Data = paginatedResult.Data.Select(MapToDto)
        };
    }

    public async Task<ReservationDto> GetReservationByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var reservation = await _reservationRepository.GetByIdAsync(id, cancellationToken);
        if (reservation == null)
        {
            throw new NotFoundException($"Reservation with id {id} not found.");
        }

        return MapToDto(reservation);
    }

    public Task<ReservationDto> CreateReservationAsync(CreateReservationDto createReservationDto, CancellationToken cancellationToken = default)
    {
        // Note: CreateReservationDto needs to be updated in Phase 2 to match new structure
        // For now, this will need to be updated when CreateReservationDto is refactored
        throw new NotImplementedException("CreateReservationAsync needs to be updated with new Reservation structure. This will be handled in Phase 2.");
    }

    private static ReservationDto MapToDto(Reservation reservation)
    {
        return new ReservationDto
        {
            Id = reservation.Id,
            UserId = reservation.UserId,
            UserName = reservation.User?.Name ?? string.Empty,
            RestaurantId = reservation.RestaurantId,
            RestaurantName = reservation.Restaurant?.Name ?? string.Empty,
            MenuId = reservation.MenuId,
            MenuDate = reservation.Menu?.Date ?? reservation.Date,
            MealTimeSlotId = reservation.MealTimeSlotId,
            MealTimeSlotName = reservation.MealTimeSlot?.Name ?? string.Empty,
            Date = reservation.Date,
            Appetizer = reservation.Appetizer,
            CreatedAt = reservation.CreatedAt,
            UpdatedAt = reservation.UpdatedAt
        };
    }
}
