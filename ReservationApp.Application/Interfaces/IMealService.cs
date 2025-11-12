using ReservationApp.Application.DTOs;

namespace ReservationApp.Application.Interfaces;

public interface IMealService
{
    Task<IEnumerable<MealDto>> GetAllMealsAsync(Guid? restaurantId = null, Guid? categoryId = null, CancellationToken cancellationToken = default);
}

