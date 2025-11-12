using ReservationApp.Application.DTOs;

namespace ReservationApp.Application.Interfaces;

public interface IMealTimeSlotService
{
    Task<IEnumerable<MealTimeSlotDto>> GetAllMealTimeSlotsAsync(CancellationToken cancellationToken = default);
}

