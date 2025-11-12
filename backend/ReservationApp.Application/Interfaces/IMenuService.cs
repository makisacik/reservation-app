using ReservationApp.Application.DTOs;

namespace ReservationApp.Application.Interfaces;

public interface IMenuService
{
    Task<IEnumerable<MenuDto>> GetMenusAsync(MenuQueryParams query, CancellationToken cancellationToken = default);
    Task<MenuDto> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<MenuDto> CreateAsync(MenuCreateDto dto, CancellationToken cancellationToken = default);
    Task<MenuDto> UpdateAsync(Guid id, MenuUpdateDto dto, CancellationToken cancellationToken = default);
    Task DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}

