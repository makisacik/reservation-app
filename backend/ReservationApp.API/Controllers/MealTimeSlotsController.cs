using Microsoft.AspNetCore.Mvc;
using ReservationApp.Application.Interfaces;

namespace ReservationApp.API.Controllers;

[ApiController]
[Route("api/mealtimes")]
public class MealTimeSlotsController : ControllerBase
{
    private readonly IMealTimeSlotService _mealTimeSlotService;
    private readonly ILogger<MealTimeSlotsController> _logger;

    public MealTimeSlotsController(IMealTimeSlotService mealTimeSlotService, ILogger<MealTimeSlotsController> logger)
    {
        _mealTimeSlotService = mealTimeSlotService;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Application.DTOs.MealTimeSlotDto>>> GetMealTimeSlots(CancellationToken cancellationToken)
    {
        _logger.LogInformation("Getting all meal time slots");
        var mealTimeSlots = await _mealTimeSlotService.GetAllMealTimeSlotsAsync(cancellationToken);
        return Ok(mealTimeSlots);
    }
}

