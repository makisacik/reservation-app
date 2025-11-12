using ReservationApp.Domain.Entities;

namespace ReservationApp.Application.Interfaces;

public interface IRestaurantRepository
{
    Task<Restaurant?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IEnumerable<Restaurant>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<Restaurant> AddAsync(Restaurant restaurant, CancellationToken cancellationToken = default);
    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}

