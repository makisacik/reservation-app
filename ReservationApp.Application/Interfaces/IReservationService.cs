using ReservationApp.Application.DTOs;

namespace ReservationApp.Application.Interfaces;

public interface IReservationService
{
    Task<IEnumerable<ReservationDto>> GetAllReservationsAsync(CancellationToken cancellationToken = default);
    Task<PaginatedResult<ReservationDto>> GetReservationsAsync(ReservationQueryParams query, CancellationToken cancellationToken = default);
    Task<ReservationDto> GetReservationByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<ReservationDto> CreateAsync(CreateReservationDto dto, Guid userId, CancellationToken cancellationToken = default);
    Task<IEnumerable<ReservationDto>> GetMyReservationsAsync(Guid userId, CancellationToken cancellationToken = default);
    Task CancelAsync(Guid reservationId, Guid userId, CancellationToken cancellationToken = default);
}

