using ReservationApp.Application.DTOs;
using ReservationApp.Application.Interfaces;
using ReservationApp.Domain.Entities;
using ReservationApp.Domain.Exceptions;

namespace ReservationApp.Application.Services;

public class MealService : IMealService
{
    private readonly IMealRepository _mealRepository;
    private readonly IRestaurantRepository _restaurantRepository;

    public MealService(
        IMealRepository mealRepository,
        IRestaurantRepository restaurantRepository)
    {
        _mealRepository = mealRepository;
        _restaurantRepository = restaurantRepository;
    }

    public async Task<IEnumerable<MealDto>> GetAllMealsAsync(Guid? restaurantId = null, Guid? categoryId = null, CancellationToken cancellationToken = default)
    {
        var meals = await _mealRepository.GetAllAsync(restaurantId, categoryId, cancellationToken);
        return meals.Select(MapToDto);
    }

    public async Task<MealDto> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var meal = await _mealRepository.GetByIdAsync(id, cancellationToken);
        if (meal == null)
        {
            throw new NotFoundException($"Meal with id {id} not found.");
        }

        return MapToDto(meal);
    }

    public async Task<MealDto> CreateAsync(MealCreateDto dto, CancellationToken cancellationToken = default)
    {
        var restaurant = await _restaurantRepository.GetByIdAsync(dto.RestaurantId, cancellationToken);
        if (restaurant == null)
        {
            throw new NotFoundException($"Restaurant with id {dto.RestaurantId} not found.");
        }

        var categoryExists = await _mealRepository.CategoryExistsAsync(dto.CategoryId, cancellationToken);
        if (!categoryExists)
        {
            throw new NotFoundException($"Category with id {dto.CategoryId} not found.");
        }

        var meal = new Meal(
            dto.Name,
            dto.CategoryId,
            dto.RestaurantId,
            dto.Description,
            dto.Kcal,
            dto.Price,
            dto.ImageUrl
        );

        await _mealRepository.AddAsync(meal, cancellationToken);
        await _mealRepository.SaveChangesAsync(cancellationToken);

        var createdMeal = await _mealRepository.GetByIdAsync(meal.Id, cancellationToken);
        if (createdMeal == null)
        {
            throw new DomainException("Failed to retrieve created meal.");
        }

        return MapToDto(createdMeal);
    }

    public async Task<MealDto> UpdateAsync(Guid id, MealUpdateDto dto, CancellationToken cancellationToken = default)
    {
        var meal = await _mealRepository.GetByIdAsync(id, cancellationToken);
        if (meal == null)
        {
            throw new NotFoundException($"Meal with id {id} not found.");
        }

        var categoryExists = await _mealRepository.CategoryExistsAsync(dto.CategoryId, cancellationToken);
        if (!categoryExists)
        {
            throw new NotFoundException($"Category with id {dto.CategoryId} not found.");
        }

        meal.Update(dto.Name, dto.CategoryId, dto.Description, dto.Kcal, dto.Price, dto.ImageUrl);

        await _mealRepository.UpdateAsync(meal, cancellationToken);
        await _mealRepository.SaveChangesAsync(cancellationToken);

        var updatedMeal = await _mealRepository.GetByIdAsync(meal.Id, cancellationToken);
        if (updatedMeal == null)
        {
            throw new DomainException("Failed to retrieve updated meal.");
        }

        return MapToDto(updatedMeal);
    }

    public async Task DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var meal = await _mealRepository.GetByIdAsync(id, cancellationToken);
        if (meal == null)
        {
            return;
        }

        await _mealRepository.DeleteAsync(meal, cancellationToken);
        await _mealRepository.SaveChangesAsync(cancellationToken);
    }

    private static MealDto MapToDto(Meal meal)
    {
        return new MealDto
        {
            Id = meal.Id,
            Name = meal.Name,
            Description = meal.Description,
            Kcal = meal.Kcal,
            Price = meal.Price,
            CategoryId = meal.CategoryId,
            CategoryName = meal.Category.Name,
            RestaurantId = meal.RestaurantId,
            RestaurantName = meal.Restaurant.Name,
            ImageUrl = meal.ImageUrl
        };
    }
}

