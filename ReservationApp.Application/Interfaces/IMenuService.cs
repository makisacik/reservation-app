using ReservationApp.Application.DTOs;

namespace ReservationApp.Application.Interfaces;

public interface IMenuService
{
    Task<IEnumerable<MenuDto>> GetMenusAsync(MenuQueryParams query, CancellationToken cancellationToken = default);
}

