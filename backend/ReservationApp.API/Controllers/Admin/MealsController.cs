using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ReservationApp.Application.DTOs;
using ReservationApp.Application.Interfaces;

namespace ReservationApp.API.Controllers.Admin;

[ApiController]
[Route("api/admin/meals")]
[Authorize(Roles = "Admin")]
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
    public async Task<ActionResult<IEnumerable<MealDto>>> GetMeals(
        [FromQuery] Guid? restaurantId,
        [FromQuery] Guid? categoryId,
        CancellationToken cancellationToken)
    {
        _logger.LogInformation("Admin getting meals - RestaurantId: {RestaurantId}, CategoryId: {CategoryId}", 
            restaurantId, categoryId);
        
        var meals = await _mealService.GetAllMealsAsync(restaurantId, categoryId, cancellationToken);
        return Ok(meals);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<MealDto>> GetMeal(Guid id, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Admin getting meal with id: {Id}", id);
        var meal = await _mealService.GetByIdAsync(id, cancellationToken);
        return Ok(meal);
    }

    [HttpPost]
    public async Task<ActionResult<MealDto>> CreateMeal(
        [FromBody] MealCreateDto dto,
        CancellationToken cancellationToken)
    {
        _logger.LogInformation("Admin creating meal - Name: {Name}, RestaurantId: {RestaurantId}", 
            dto.Name, dto.RestaurantId);
        
        var meal = await _mealService.CreateAsync(dto, cancellationToken);
        return CreatedAtAction(nameof(GetMeal), new { id = meal.Id }, meal);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<MealDto>> UpdateMeal(
        Guid id,
        [FromBody] MealUpdateDto dto,
        CancellationToken cancellationToken)
    {
        _logger.LogInformation("Admin updating meal with id: {Id}", id);
        var meal = await _mealService.UpdateAsync(id, dto, cancellationToken);
        return Ok(meal);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteMeal(Guid id, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Admin deleting meal with id: {Id}", id);
        await _mealService.DeleteAsync(id, cancellationToken);
        return NoContent();
    }
}

