using Microsoft.AspNetCore.Mvc;
using ReservationApp.Application.Interfaces;

namespace ReservationApp.API.Controllers;

[ApiController]
[Route("api/meals")]
public class MealsController : ControllerBase
{
    private readonly IMealService _mealService;
    private readonly ILogger<MealsController> _logger;

    public MealsController(IMealService mealService, ILogger<MealsController> logger)
    {
        _mealService = mealService;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Application.DTOs.MealDto>>> GetMeals(
        [FromQuery] Guid? restaurantId,
        [FromQuery] Guid? categoryId,
        CancellationToken cancellationToken)
    {
        _logger.LogInformation("Getting meals - RestaurantId: {RestaurantId}, CategoryId: {CategoryId}", restaurantId, categoryId);
        var meals = await _mealService.GetAllMealsAsync(restaurantId, categoryId, cancellationToken);
        return Ok(meals);
    }
}

