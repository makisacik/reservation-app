using Microsoft.AspNetCore.Mvc;
using ReservationApp.Application.Interfaces;

namespace ReservationApp.API.Controllers;

[ApiController]
[Route("api/restaurants")]
public class RestaurantsController : ControllerBase
{
    private readonly IRestaurantService _restaurantService;
    private readonly ILogger<RestaurantsController> _logger;

    public RestaurantsController(IRestaurantService restaurantService, ILogger<RestaurantsController> logger)
    {
        _restaurantService = restaurantService;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Application.DTOs.RestaurantDto>>> GetRestaurants(CancellationToken cancellationToken)
    {
        _logger.LogInformation("Getting all restaurants");
        var restaurants = await _restaurantService.GetAllRestaurantsAsync(cancellationToken);
        return Ok(restaurants);
    }
}

