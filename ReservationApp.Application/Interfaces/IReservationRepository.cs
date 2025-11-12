using ReservationApp.Application.DTOs;
using ReservationApp.Domain.Entities;

namespace ReservationApp.Application.Interfaces;

public interface IReservationRepository
{
    Task<Reservation?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IEnumerable<Reservation>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<PaginatedResult<Reservation>> GetPaginatedAsync(ReservationQueryParams query, CancellationToken cancellationToken = default);
    Task<Reservation> AddAsync(Reservation entity, CancellationToken cancellationToken = default);
    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}

