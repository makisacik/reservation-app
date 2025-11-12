using ReservationApp.Domain.Entities;

namespace ReservationApp.Application.Interfaces;

public interface IMealRepository
{
    Task<Meal?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IEnumerable<Meal>> GetAllAsync(Guid? restaurantId = null, Guid? categoryId = null, CancellationToken cancellationToken = default);
    Task<Meal> AddAsync(Meal meal, CancellationToken cancellationToken = default);
    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}

