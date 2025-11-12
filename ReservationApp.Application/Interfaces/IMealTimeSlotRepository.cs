using ReservationApp.Domain.Entities;

namespace ReservationApp.Application.Interfaces;

public interface IMealTimeSlotRepository
{
    Task<MealTimeSlot?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<IEnumerable<MealTimeSlot>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<MealTimeSlot> AddAsync(MealTimeSlot mealTimeSlot, CancellationToken cancellationToken = default);
    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}

