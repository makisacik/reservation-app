using ReservationApp.Application.DTOs;
using ReservationApp.Application.Interfaces;

namespace ReservationApp.Application.Services;

public class MealService : IMealService
{
    private readonly IMealRepository _mealRepository;

    public MealService(IMealRepository mealRepository)
    {
        _mealRepository = mealRepository;
    }

    public async Task<IEnumerable<MealDto>> GetAllMealsAsync(Guid? restaurantId = null, Guid? categoryId = null, CancellationToken cancellationToken = default)
    {
        var meals = await _mealRepository.GetAllAsync(restaurantId, categoryId, cancellationToken);
        return meals.Select(m => new MealDto
        {
            Id = m.Id,
            Name = m.Name,
            Description = m.Description,
            Kcal = m.Kcal,
            CategoryId = m.CategoryId,
            CategoryName = m.Category.Name,
            RestaurantId = m.RestaurantId,
            RestaurantName = m.Restaurant.Name,
            ImageUrl = m.ImageUrl
        });
    }
}

