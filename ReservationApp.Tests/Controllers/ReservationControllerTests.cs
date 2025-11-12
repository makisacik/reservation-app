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
    public async Task GetReservations_ShouldReturnOkResultWithReservations()
    {
        // Arrange
        var reservations = new List<ReservationDto>
        {
            new ReservationDto { Id = Guid.NewGuid(), CustomerName = "John Doe", Date = DateTime.UtcNow.AddDays(1), Guests = 2 },
            new ReservationDto { Id = Guid.NewGuid(), CustomerName = "Jane Smith", Date = DateTime.UtcNow.AddDays(2), Guests = 4 }
        };

        _serviceMock.Setup(s => s.GetAllReservationsAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(reservations);

        // Act
        var result = await _controller.GetReservations(CancellationToken.None);

        // Assert
        var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        var returnedReservations = okResult.Value.Should().BeAssignableTo<IEnumerable<ReservationDto>>().Subject;
        returnedReservations.Should().HaveCount(2);
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

