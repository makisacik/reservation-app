using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Moq;
using ReservationApp.Application.DTOs;
using ReservationApp.Application.Interfaces;
using ReservationApp.Application.Services;
using ReservationApp.Domain.Entities;
using ReservationApp.Domain.Enums;
using ReservationApp.Infrastructure.Data;
using ReservationApp.Infrastructure.Repositories;
using Xunit;

namespace ReservationApp.Tests.Services;

public class ReportServiceTests
{
    private readonly Mock<IReportRepository> _repositoryMock;
    private readonly ReportService _service;

    public ReportServiceTests()
    {
        _repositoryMock = new Mock<IReportRepository>();
        _service = new ReportService(_repositoryMock.Object);
    }

    [Fact]
    public async Task GetSummaryAsync_ShouldReturnSummary()
    {
        // Arrange
        _repositoryMock.Setup(r => r.CountReservationsAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(100);
        _repositoryMock.Setup(r => r.CountUsersAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(50);
        _repositoryMock.Setup(r => r.CountMealsAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(200);
        _repositoryMock.Setup(r => r.CountRestaurantsAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(10);

        // Act
        var result = await _service.GetSummaryAsync();

        // Assert
        result.Should().NotBeNull();
        result.TotalReservations.Should().Be(100);
        result.TotalUsers.Should().Be(50);
        result.TotalMeals.Should().Be(200);
        result.TotalRestaurants.Should().Be(10);
    }

    [Fact]
    public async Task GetPopularMealsAsync_ShouldReturnPopularMeals()
    {
        // Arrange
        var popularMeals = new List<PopularMealDto>
        {
            new PopularMealDto { MealId = Guid.NewGuid(), MealName = "Meal 1", ReservationCount = 100 },
            new PopularMealDto { MealId = Guid.NewGuid(), MealName = "Meal 2", ReservationCount = 80 },
            new PopularMealDto { MealId = Guid.NewGuid(), MealName = "Meal 3", ReservationCount = 60 }
        };

        _repositoryMock.Setup(r => r.GetPopularMealsAsync(10, ReservationStatus.Active, It.IsAny<CancellationToken>()))
            .ReturnsAsync(popularMeals);

        // Act
        var result = await _service.GetPopularMealsAsync(10);

        // Assert
        result.Should().NotBeNull();
        result.Should().HaveCount(3);
        result.First().ReservationCount.Should().Be(100);
    }

    [Fact]
    public async Task GetPopularMealsAsync_ShouldUseDefaultCount()
    {
        // Arrange
        var popularMeals = new List<PopularMealDto>
        {
            new PopularMealDto { MealId = Guid.NewGuid(), MealName = "Meal 1", ReservationCount = 100 }
        };

        _repositoryMock.Setup(r => r.GetPopularMealsAsync(10, ReservationStatus.Active, It.IsAny<CancellationToken>()))
            .ReturnsAsync(popularMeals);

        // Act
        var result = await _service.GetPopularMealsAsync();

        // Assert
        result.Should().NotBeNull();
        _repositoryMock.Verify(r => r.GetPopularMealsAsync(10, ReservationStatus.Active, It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task GetWeeklyTrendsAsync_ShouldReturnWeeklyTrends()
    {
        // Arrange
        var startDate = DateTime.UtcNow.AddDays(-28);
        var endDate = DateTime.UtcNow;

        var trends = new List<WeeklyTrendDto>
        {
            new WeeklyTrendDto { WeekStart = startDate, WeekEnd = startDate.AddDays(6), ReservationCount = 50 },
            new WeeklyTrendDto { WeekStart = startDate.AddDays(7), WeekEnd = startDate.AddDays(13), ReservationCount = 60 },
            new WeeklyTrendDto { WeekStart = startDate.AddDays(14), WeekEnd = startDate.AddDays(20), ReservationCount = 70 },
            new WeeklyTrendDto { WeekStart = startDate.AddDays(21), WeekEnd = startDate.AddDays(27), ReservationCount = 80 }
        };

        _repositoryMock.Setup(r => r.GetWeeklyTrendsAsync(It.IsAny<DateTime>(), It.IsAny<DateTime>(), ReservationStatus.Active, It.IsAny<CancellationToken>()))
            .ReturnsAsync(trends);

        // Act
        var result = await _service.GetWeeklyTrendsAsync();

        // Assert
        result.Should().NotBeNull();
        result.Should().HaveCount(4);
        result.First().ReservationCount.Should().Be(50);
    }

    [Fact]
    public async Task GetWeeklyTrendsAsync_ShouldUseCustomDateRange()
    {
        // Arrange
        var startDate = DateTime.UtcNow.AddDays(-14);
        var endDate = DateTime.UtcNow.AddDays(-7);

        var trends = new List<WeeklyTrendDto>
        {
            new WeeklyTrendDto { WeekStart = startDate, WeekEnd = startDate.AddDays(6), ReservationCount = 30 }
        };

        _repositoryMock.Setup(r => r.GetWeeklyTrendsAsync(startDate, endDate, ReservationStatus.Active, It.IsAny<CancellationToken>()))
            .ReturnsAsync(trends);

        // Act
        var result = await _service.GetWeeklyTrendsAsync(startDate, endDate);

        // Assert
        result.Should().NotBeNull();
        result.Should().HaveCount(1);
        _repositoryMock.Verify(r => r.GetWeeklyTrendsAsync(startDate, endDate, ReservationStatus.Active, It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task GetWeeklyTrendsAsync_ShouldUseDefaultDateRange_WhenNotSpecified()
    {
        // Arrange
        var defaultStartDate = DateTime.UtcNow.AddDays(-28);
        var endDate = DateTime.UtcNow;

        var trends = new List<WeeklyTrendDto>();

        _repositoryMock.Setup(r => r.GetWeeklyTrendsAsync(It.Is<DateTime>(d => d >= defaultStartDate.AddMinutes(-1) && d <= defaultStartDate.AddMinutes(1)), 
                It.Is<DateTime>(d => d >= endDate.AddMinutes(-1) && d <= endDate.AddMinutes(1)), 
                ReservationStatus.Active, It.IsAny<CancellationToken>()))
            .ReturnsAsync(trends);

        // Act
        var result = await _service.GetWeeklyTrendsAsync();

        // Assert
        result.Should().NotBeNull();
        _repositoryMock.Verify(r => r.GetWeeklyTrendsAsync(It.IsAny<DateTime>(), It.IsAny<DateTime>(), ReservationStatus.Active, It.IsAny<CancellationToken>()), Times.Once);
    }
}

