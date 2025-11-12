using FluentAssertions;
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
    }

    [Fact]
    public async Task GetReservations_ShouldReturnOkResultWithPaginatedReservations()
    {
        // Arrange
        var queryParams = new ReservationQueryParams { Page = 1, PageSize = 10 };
        var reservations = new List<ReservationDto>
        {
            new ReservationDto { Id = Guid.NewGuid(), CustomerName = "John Doe", Date = DateTime.UtcNow.AddDays(1), Guests = 2 },
            new ReservationDto { Id = Guid.NewGuid(), CustomerName = "Jane Smith", Date = DateTime.UtcNow.AddDays(2), Guests = 4 }
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
            CustomerName = "John Doe",
            Date = DateTime.UtcNow.AddDays(1),
            Guests = 2
        };

        _serviceMock.Setup(s => s.GetReservationByIdAsync(reservationId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(reservation);

        // Act
        var result = await _controller.GetReservation(reservationId, CancellationToken.None);

        // Assert
        var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        var returnedReservation = okResult.Value.Should().BeOfType<ReservationDto>().Subject;
        returnedReservation.Id.Should().Be(reservationId);
    }

    [Fact]
    public async Task CreateReservation_ShouldReturnCreatedResult()
    {
        // Arrange
        var createDto = new CreateReservationDto
        {
            CustomerName = "John Doe",
            Date = DateTime.UtcNow.AddDays(1),
            Guests = 2
        };

        var reservationDto = new ReservationDto
        {
            Id = Guid.NewGuid(),
            CustomerName = createDto.CustomerName,
            Date = createDto.Date,
            Guests = createDto.Guests
        };

        _serviceMock.Setup(s => s.CreateReservationAsync(createDto, It.IsAny<CancellationToken>()))
            .ReturnsAsync(reservationDto);

        // Act
        var result = await _controller.CreateReservation(createDto, CancellationToken.None);

        // Assert
        var createdResult = result.Result.Should().BeOfType<CreatedAtActionResult>().Subject;
        var returnedReservation = createdResult.Value.Should().BeOfType<ReservationDto>().Subject;
        returnedReservation.CustomerName.Should().Be(createDto.CustomerName);
    }
}

