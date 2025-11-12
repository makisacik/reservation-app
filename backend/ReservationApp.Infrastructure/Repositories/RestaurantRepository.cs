using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ReservationApp.Application.Interfaces;
using ReservationApp.Domain.Entities;
using ReservationApp.Infrastructure.Data;

namespace ReservationApp.Infrastructure.Repositories;

public class RestaurantRepository : Repository<Restaurant>, IRestaurantRepository
{
    private readonly ReservationDbContext _dbContext;
    private new readonly ILogger<RestaurantRepository> _logger;

    public RestaurantRepository(ReservationDbContext context, ILogger<RestaurantRepository> logger)
        : base(context, logger)
    {
        _dbContext = context;
        _logger = logger;
    }

    public async Task SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}

