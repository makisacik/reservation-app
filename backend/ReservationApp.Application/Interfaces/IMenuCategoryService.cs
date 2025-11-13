using ReservationApp.Application.DTOs;

namespace ReservationApp.Application.Interfaces;

public interface IMenuCategoryService
{
    Task<IEnumerable<MenuCategoryDto>> GetAllCategoriesAsync(CancellationToken cancellationToken = default);
}

