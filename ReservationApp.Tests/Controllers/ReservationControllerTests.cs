using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using ReservationApp.API.Controllers;
using ReservationApp.Application.DTOs;
using ReservationApp.Application.Interfaces;
using Xunit;

namespace ReservationApp.Tests.Controllers;

public class ReservationControllerTests
{
    private readonly Mock<IReservationService> _serviceMock;
    private readonly Mock<ILogger<ReservationController>> _loggerMock;
    private readonly ReservationController _controller;

    public ReservationControllerTests()
    {
        _serviceMock = new Mock<IReservationService>();
        _loggerMock = new Mock<ILogger<ReservationController>>();
        _controller = new ReservationController(_serviceMock.Object, _loggerMock.Object);
        
        // Setup controller context with user claims
        var userId = Guid.NewGuid();
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
            new Claim(JwtRegisteredClaimNames.Sub, userId.ToString())
        };
        var identity = new ClaimsIdentity(claims, "Test");
        var principal = new ClaimsPrincipal(identity);
        _controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext
            {
                User = principal
            }
        };
    }

    [Fact]
    public async Task GetReservations_ShouldReturnOkResultWithPaginatedReservations()
    {
        // Arrange
        var queryParams = new ReservationQueryParams { Page = 1, PageSize = 10 };
        var reservations = new List<ReservationDto>
        {
            new ReservationDto 
            { 
                Id = Guid.NewGuid(), 
                UserId = Guid.NewGuid(),
                UserName = "John Doe",
                RestaurantId = Guid.NewGuid(),
                RestaurantName = "Test Restaurant",
                MenuId = Guid.NewGuid(),
                MenuDate = DateTime.UtcNow.AddDays(1),
                MealTimeSlotId = 1,
                MealTimeSlotName = "Breakfast",
                Date = DateTime.UtcNow.AddDays(1),
                Appetizer = false
            },
            new ReservationDto 
            { 
                Id = Guid.NewGuid(),
                UserId = Guid.NewGuid(),
                UserName = "Jane Smith",
                RestaurantId = Guid.NewGuid(),
                RestaurantName = "Test Restaurant",
                MenuId = Guid.NewGuid(),
                MenuDate = DateTime.UtcNow.AddDays(2),
                MealTimeSlotId = 2,
                MealTimeSlotName = "Lunch",
                Date = DateTime.UtcNow.AddDays(2),
                Appetizer = true
            }
        };

        var paginatedResult = new PaginatedResult<ReservationDto>
        {
            Page = 1,
            PageSize = 10,
            TotalCount = 2,
            TotalPages = 1,
            Data = reservations
        };

        _serviceMock.Setup(s => s.GetReservationsAsync(It.IsAny<ReservationQueryParams>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(paginatedResult);

        // Act
        var result = await _controller.GetReservations(queryParams, CancellationToken.None);

        // Assert
        var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        var returnedResult = okResult.Value.Should().BeOfType<PaginatedResult<ReservationDto>>().Subject;
        returnedResult.Data.Should().HaveCount(2);
        returnedResult.TotalCount.Should().Be(2);
        returnedResult.Page.Should().Be(1);
        returnedResult.PageSize.Should().Be(10);
    }

    [Fact]
    public async Task GetReservation_WhenReservationExists_ShouldReturnOkResult()
    {
        // Arrange
        var reservationId = Guid.NewGuid();
        var reservation = new ReservationDto
        {
            Id = reservationId,
            UserId = Guid.NewGuid(),
            UserName = "John Doe",
            RestaurantId = Guid.NewGuid(),
            RestaurantName = "Test Restaurant",
            MenuId = Guid.NewGuid(),
            MenuDate = DateTime.UtcNow.AddDays(1),
            MealTimeSlotId = 1,
            MealTimeSlotName = "Breakfast",
            Date = DateTime.UtcNow.AddDays(1),
            Appetizer = false
        };

        _serviceMock.Setup(s => s.GetReservationByIdAsync(reservationId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(reservation);

        // Act
        var result = await _controller.GetReservation(reservationId, CancellationToken.None);

        // Assert
        var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        var returnedReservation = okResult.Value.Should().BeOfType<ReservationDto>().Subject;
        returnedReservation.Id.Should().Be(reservationId);
        returnedReservation.UserName.Should().Be("John Doe");
    }

    [Fact]
    public async Task CreateReservation_ShouldReturnCreatedResult()
    {
        // Arrange
        var userId = Guid.Parse(_controller.ControllerContext.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var createDto = new CreateReservationDto
        {
            RestaurantId = Guid.NewGuid(),
            MenuId = Guid.NewGuid(),
            MealTimeSlotId = 1,
            Date = DateTime.UtcNow.AddDays(1),
            Appetizer = false
        };

        var reservationDto = new ReservationDto
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            UserName = "Test User",
            RestaurantId = createDto.RestaurantId,
            RestaurantName = "Test Restaurant",
            MenuId = createDto.MenuId,
            MenuDate = createDto.Date,
            MealTimeSlotId = createDto.MealTimeSlotId,
            MealTimeSlotName = "Breakfast",
            Date = createDto.Date,
            Appetizer = createDto.Appetizer
        };

        _serviceMock.Setup(s => s.CreateAsync(createDto, userId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(reservationDto);

        // Act
        var result = await _controller.CreateReservation(createDto, CancellationToken.None);

        // Assert
        var createdResult = result.Result.Should().BeOfType<CreatedAtActionResult>().Subject;
        var returnedReservation = createdResult.Value.Should().BeOfType<ReservationDto>().Subject;
        returnedReservation.RestaurantId.Should().Be(createDto.RestaurantId);
        returnedReservation.MenuId.Should().Be(createDto.MenuId);
    }

    [Fact]
    public async Task GetMyReservations_ShouldReturnOkResult()
    {
        // Arrange
        var userId = Guid.Parse(_controller.ControllerContext.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var reservations = new List<ReservationDto>
        {
            new ReservationDto
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                UserName = "Test User",
                RestaurantId = Guid.NewGuid(),
                RestaurantName = "Test Restaurant",
                MenuId = Guid.NewGuid(),
                MenuDate = DateTime.UtcNow.AddDays(1),
                MealTimeSlotId = 1,
                MealTimeSlotName = "Breakfast",
                Date = DateTime.UtcNow.AddDays(1),
                Appetizer = false
            }
        };

        _serviceMock.Setup(s => s.GetMyReservationsAsync(userId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(reservations);

        // Act
        var result = await _controller.GetMyReservations(CancellationToken.None);

        // Assert
        var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        var returnedReservations = okResult.Value.Should().BeAssignableTo<IEnumerable<ReservationDto>>().Subject;
        returnedReservations.Should().HaveCount(1);
    }

    [Fact]
    public async Task CancelReservation_ShouldReturnNoContent()
    {
        // Arrange
        var userId = Guid.Parse(_controller.ControllerContext.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var reservationId = Guid.NewGuid();

        _serviceMock.Setup(s => s.CancelAsync(reservationId, userId, It.IsAny<CancellationToken>()))
            .Returns(Task.CompletedTask);

        // Act
        var result = await _controller.CancelReservation(reservationId, CancellationToken.None);

        // Assert
        result.Should().BeOfType<NoContentResult>();
        _serviceMock.Verify(s => s.CancelAsync(reservationId, userId, It.IsAny<CancellationToken>()), Times.Once);
    }
}

