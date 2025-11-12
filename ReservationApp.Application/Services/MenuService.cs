using ReservationApp.Application.DTOs;
using ReservationApp.Application.Interfaces;
using ReservationApp.Domain.Entities;
using ReservationApp.Domain.Exceptions;

namespace ReservationApp.Application.Services;

public class MenuService : IMenuService
{
    private readonly IMenuRepository _menuRepository;
    private readonly IRestaurantRepository _restaurantRepository;
    private readonly IMealRepository _mealRepository;

    public MenuService(
        IMenuRepository menuRepository,
        IRestaurantRepository restaurantRepository,
        IMealRepository mealRepository)
    {
        _menuRepository = menuRepository;
        _restaurantRepository = restaurantRepository;
        _mealRepository = mealRepository;
    }

    public async Task<IEnumerable<MenuDto>> GetMenusAsync(MenuQueryParams query, CancellationToken cancellationToken = default)
    {
        var menus = await _menuRepository.GetMenusAsync(query, cancellationToken);
        return menus.Select(MapToDto);
    }

    public async Task<MenuDto> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var menu = await _menuRepository.GetByIdAsync(id, cancellationToken);
        if (menu == null)
        {
            throw new NotFoundException($"Menu with id {id} not found.");
        }

        return MapToDto(menu);
    }

    public async Task<MenuDto> CreateAsync(MenuCreateDto dto, CancellationToken cancellationToken = default)
    {
        // Validate restaurant exists
        var restaurant = await _restaurantRepository.GetByIdAsync(dto.RestaurantId, cancellationToken);
        if (restaurant == null)
        {
            throw new NotFoundException($"Restaurant with id {dto.RestaurantId} not found.");
        }

        // Validate meals exist and load them
        List<Meal> meals = new();
        if (dto.MealIds != null && dto.MealIds.Count > 0)
        {
            meals = (await _mealRepository.GetByIdsAsync(dto.MealIds, cancellationToken)).ToList();

            if (meals.Count != dto.MealIds.Count)
            {
                var foundIds = meals.Select(m => m.Id).ToList();
                var missingIds = dto.MealIds.Except(foundIds).ToList();
                throw new NotFoundException($"Meals with ids {string.Join(", ", missingIds)} not found.");
            }
        }

        // Create menu
        var menu = new Menu(dto.RestaurantId, dto.Date, dto.MenuType);

        // Add meals to menu (EF Core will handle many-to-many)
        foreach (var meal in meals)
        {
            menu.Meals.Add(meal);
        }

        await _menuRepository.AddAsync(menu, cancellationToken);
        await _menuRepository.SaveChangesAsync(cancellationToken);

        // Reload with navigation properties
        var createdMenu = await _menuRepository.GetByIdAsync(menu.Id, cancellationToken);
        if (createdMenu == null)
        {
            throw new DomainException("Failed to retrieve created menu.");
        }

        return MapToDto(createdMenu);
    }

    public async Task<MenuDto> UpdateAsync(Guid id, MenuUpdateDto dto, CancellationToken cancellationToken = default)
    {
        var menu = await _menuRepository.GetByIdAsync(id, cancellationToken);
        if (menu == null)
        {
            throw new NotFoundException($"Menu with id {id} not found.");
        }

        // Update menu properties
        menu.Update(dto.Date, dto.MenuType);

        // Update meal relationships (EF Core will sync many-to-many automatically)
        if (dto.MealIds != null)
        {
            // Validate meals exist and load them
            List<Meal> meals = new();
            if (dto.MealIds.Count > 0)
            {
                meals = (await _mealRepository.GetByIdsAsync(dto.MealIds, cancellationToken)).ToList();

                if (meals.Count != dto.MealIds.Count)
                {
                    var foundIds = meals.Select(m => m.Id).ToList();
                    var missingIds = dto.MealIds.Except(foundIds).ToList();
                    throw new NotFoundException($"Meals with ids {string.Join(", ", missingIds)} not found.");
                }
            }

            // Clear existing meals
            menu.Meals.Clear();

            // Add new meals
            foreach (var meal in meals)
            {
                menu.Meals.Add(meal);
            }
        }

        await _menuRepository.UpdateAsync(menu, cancellationToken);
        await _menuRepository.SaveChangesAsync(cancellationToken);

        // Reload with navigation properties
        var updatedMenu = await _menuRepository.GetByIdAsync(menu.Id, cancellationToken);
        if (updatedMenu == null)
        {
            throw new DomainException("Failed to retrieve updated menu.");
        }

        return MapToDto(updatedMenu);
    }

    public async Task DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var menu = await _menuRepository.GetByIdAsync(id, cancellationToken);
        if (menu == null)
        {
            throw new NotFoundException($"Menu with id {id} not found.");
        }

        await _menuRepository.DeleteAsync(menu, cancellationToken);
        await _menuRepository.SaveChangesAsync(cancellationToken);
    }

    private static MenuDto MapToDto(Menu menu)
    {
        return new MenuDto
        {
            Id = menu.Id,
            RestaurantId = menu.RestaurantId,
            RestaurantName = menu.Restaurant.Name,
            Date = menu.Date,
            MenuType = menu.MenuType,
            Meals = menu.Meals.Select(meal => new MealDto
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
        };
    }
}

