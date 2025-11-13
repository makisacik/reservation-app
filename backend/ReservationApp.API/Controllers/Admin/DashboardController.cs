using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ReservationApp.Application.Interfaces;

namespace ReservationApp.API.Controllers.Admin;

[ApiController]
[Route("api/admin/dashboard")]
[Authorize(Roles = "Admin")]
public class DashboardController : ControllerBase
{
    private readonly IReportService _reportService;
    private readonly ILogger<DashboardController> _logger;

    public DashboardController(IReportService reportService, ILogger<DashboardController> logger)
    {
        _reportService = reportService;
        _logger = logger;
    }

    [HttpGet("summary")]
    public async Task<ActionResult> GetSummary(CancellationToken cancellationToken)
    {
        _logger.LogInformation("Admin getting dashboard summary");
        var summary = await _reportService.GetSummaryAsync(cancellationToken);
        return Ok(summary);
    }

    [HttpGet("popular-meals")]
    public async Task<ActionResult> GetPopularMeals(
        [FromQuery] int count = 10,
        CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Admin getting popular meals - Count: {Count}", count);
        var popularMeals = await _reportService.GetPopularMealsAsync(count, cancellationToken);
        return Ok(popularMeals);
    }

    [HttpGet("weekly")]
    public async Task<ActionResult> GetWeeklyTrends(
        [FromQuery] DateTime? startDate = null,
        [FromQuery] DateTime? endDate = null,
        CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Admin getting weekly trends - StartDate: {StartDate}, EndDate: {EndDate}", 
            startDate, endDate);
        var trends = await _reportService.GetWeeklyTrendsAsync(startDate, endDate, cancellationToken);
        return Ok(trends);
    }

    [HttpGet("today-reservations")]
    public async Task<ActionResult> GetTodayReservations(CancellationToken cancellationToken)
    {
        _logger.LogInformation("Admin getting today's reservations");
        var todayReservations = await _reportService.GetTodayReservationsAsync(cancellationToken);
        return Ok(todayReservations);
    }

    [HttpGet("daily-summary")]
    public async Task<ActionResult> GetDailySummary(CancellationToken cancellationToken)
    {
        _logger.LogInformation("Admin getting daily summary for current week");
        var dailySummary = await _reportService.GetDailyReservationsForWeekAsync(cancellationToken);
        return Ok(dailySummary);
    }
}

