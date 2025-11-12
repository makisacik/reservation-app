using ReservationApp.Application.DTOs;
using ReservationApp.Application.Interfaces;

namespace ReservationApp.Application.Services;

public class MenuService : IMenuService
{
    private readonly IMenuRepository _menuRepository;

    public MenuService(IMenuRepository menuRepository)
    {
        _menuRepository = menuRepository;
    }

    public async Task<IEnumerable<MenuDto>> GetMenusAsync(MenuQueryParams query, CancellationToken cancellationToken = default)
    {
        var menus = await _menuRepository.GetMenusAsync(query, cancellationToken);
        return menus.Select(m => new MenuDto
        {
            Id = m.Id,
            RestaurantId = m.RestaurantId,
            RestaurantName = m.Restaurant.Name,
            Date = m.Date,
            MenuType = m.MenuType,
            Meals = m.Meals.Select(meal => new MealDto
            {
                Id = meal.Id,
                Name = meal.Name,
                Description = meal.Description,
                Kcal = meal.Kcal,
                CategoryId = meal.CategoryId,
                CategoryName = meal.Category.Name,
                RestaurantId = meal.RestaurantId,
                RestaurantName = meal.Restaurant.Name,
                ImageUrl = meal.ImageUrl
            }).ToList()
        });
    }
}

