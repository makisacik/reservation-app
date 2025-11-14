using ReservationApp.Domain.Entities;

namespace ReservationApp.Application.Interfaces;

public interface IMenuCategoryRepository
{
    Task<IEnumerable<MenuCategory>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<MenuCategory?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<MenuCategory?> GetByNameAsync(string name, CancellationToken cancellationToken = default);
}



