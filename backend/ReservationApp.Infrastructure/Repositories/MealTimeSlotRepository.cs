using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ReservationApp.Application.Interfaces;
using ReservationApp.Domain.Entities;
using ReservationApp.Infrastructure.Data;

namespace ReservationApp.Infrastructure.Repositories;

public class MealTimeSlotRepository : IMealTimeSlotRepository
{
    private readonly ReservationDbContext _dbContext;
    private readonly ILogger<MealTimeSlotRepository> _logger;

    public MealTimeSlotRepository(ReservationDbContext context, ILogger<MealTimeSlotRepository> logger)
    {
        _dbContext = context;
        _logger = logger;
    }

    public async Task<MealTimeSlot?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        return await _dbContext.MealTimeSlots.FindAsync(new object[] { id }, cancellationToken);
    }

    public async Task<IEnumerable<MealTimeSlot>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _dbContext.MealTimeSlots
            .OrderBy(mts => mts.StartTime)
            .ToListAsync(cancellationToken);
    }

    public async Task<MealTimeSlot> AddAsync(MealTimeSlot mealTimeSlot, CancellationToken cancellationToken = default)
    {
        await _dbContext.MealTimeSlots.AddAsync(mealTimeSlot, cancellationToken);
        return mealTimeSlot;
    }

    public async Task SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}

