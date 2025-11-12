using ReservationApp.Application.DTOs;

namespace ReservationApp.Application.Interfaces;

public interface IRestaurantService
{
    Task<IEnumerable<RestaurantDto>> GetAllRestaurantsAsync(CancellationToken cancellationToken = default);
}

