using ReservationApp.Application.DTOs;
using ReservationApp.Domain.Entities;

namespace ReservationApp.Application.Interfaces;

public interface IReservationRepository
{
    Task<Reservation?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IEnumerable<Reservation>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<PaginatedResult<Reservation>> GetPaginatedAsync(ReservationQueryParams query, CancellationToken cancellationToken = default);
    Task<PaginatedResult<Reservation>> GetAdminFilteredAsync(AdminReservationQueryParams query, CancellationToken cancellationToken = default);
    Task<Reservation> AddAsync(Reservation entity, CancellationToken cancellationToken = default);
    Task SaveChangesAsync(CancellationToken cancellationToken = default);
    Task<bool> HasReservationForDayAsync(Guid userId, DateOnly date, int mealTimeSlotId, CancellationToken cancellationToken = default);
    Task<int> CountReservationsThisWeekAsync(Guid userId, DateOnly weekStart, DateOnly weekEnd, CancellationToken cancellationToken = default);
    Task<IEnumerable<Reservation>> GetUserReservationsAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<Reservation?> GetUserReservationByIdAsync(Guid reservationId, Guid userId, CancellationToken cancellationToken = default);
    Task DeleteAsync(Reservation reservation, CancellationToken cancellationToken = default);
}

