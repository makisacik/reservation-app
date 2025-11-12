using ReservationApp.Application.DTOs;
using ReservationApp.Application.Interfaces;

namespace ReservationApp.Application.Services;

public class MealTimeSlotService : IMealTimeSlotService
{
    private readonly IMealTimeSlotRepository _mealTimeSlotRepository;

    public MealTimeSlotService(IMealTimeSlotRepository mealTimeSlotRepository)
    {
        _mealTimeSlotRepository = mealTimeSlotRepository;
    }

    public async Task<IEnumerable<MealTimeSlotDto>> GetAllMealTimeSlotsAsync(CancellationToken cancellationToken = default)
    {
        var mealTimeSlots = await _mealTimeSlotRepository.GetAllAsync(cancellationToken);
        return mealTimeSlots.Select(mts => new MealTimeSlotDto
        {
            Id = mts.Id,
            Name = mts.Name,
            StartTime = mts.StartTime,
            EndTime = mts.EndTime
        });
    }
}

