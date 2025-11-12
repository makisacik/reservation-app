using ReservationApp.Application.DTOs;

namespace ReservationApp.Application.Interfaces;

public interface IMealService
{
    Task<IEnumerable<MealDto>> GetAllMealsAsync(Guid? restaurantId = null, Guid? categoryId = null, CancellationToken cancellationToken = default);
    Task<MealDto> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<MealDto> CreateAsync(MealCreateDto dto, CancellationToken cancellationToken = default);
    Task<MealDto> UpdateAsync(Guid id, MealUpdateDto dto, CancellationToken cancellationToken = default);
    Task DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}

