using Microsoft.AspNetCore.Mvc;
using ReservationApp.Application.Interfaces;

namespace ReservationApp.API.Controllers;

[ApiController]
[Route("api/home")]
public class HomeController : ControllerBase
{
    private readonly IReportService _reportService;
    private readonly ILogger<HomeController> _logger;

    public HomeController(IReportService reportService, ILogger<HomeController> logger)
    {
        _reportService = reportService;
        _logger = logger;
    }

    [HttpGet("stats")]
    public async Task<ActionResult> GetStats(CancellationToken cancellationToken)
    {
        _logger.LogInformation("Getting home page statistics");
        try
        {
            var stats = await _reportService.GetHomePageStatsAsync(cancellationToken);
            _logger.LogInformation("Home page statistics retrieved - TotalMeals: {TotalMeals}, MostPopular: {MostPopular}, PreferenceRate: {PreferenceRate}, AperatifCount: {AperatifCount}",
                stats.TotalMeals, stats.MostPopular, stats.PreferenceRate, stats.AperatifCount);
            return Ok(stats);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting home page statistics");
            throw;
        }
    }
}

