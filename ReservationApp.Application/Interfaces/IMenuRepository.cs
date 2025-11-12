using ReservationApp.Application.DTOs;
using ReservationApp.Domain.Entities;

namespace ReservationApp.Application.Interfaces;

public interface IMenuRepository
{
    Task<Menu?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IEnumerable<Menu>> GetMenusAsync(MenuQueryParams query, CancellationToken cancellationToken = default);
    Task<Menu> AddAsync(Menu menu, CancellationToken cancellationToken = default);
    Task UpdateAsync(Menu menu, CancellationToken cancellationToken = default);
    Task DeleteAsync(Menu menu, CancellationToken cancellationToken = default);
    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}

