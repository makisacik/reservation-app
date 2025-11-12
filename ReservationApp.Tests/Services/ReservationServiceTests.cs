using FluentAssertions;
using Moq;
using ReservationApp.Application.DTOs;
using ReservationApp.Application.Interfaces;
using ReservationApp.Application.Services;
using ReservationApp.Domain.Entities;
using ReservationApp.Domain.Enums;
using ReservationApp.Domain.Exceptions;
using Xunit;

namespace ReservationApp.Tests.Services;

public class ReservationServiceTests
{
    private readonly Mock<IReservationRepository> _repositoryMock;
    private readonly ReservationService _service;

    public ReservationServiceTests()
    {
        _repositoryMock = new Mock<IReservationRepository>();
        _service = new ReservationService(_repositoryMock.Object);
    }

    [Fact]
    public async Task GetAllReservationsAsync_ShouldReturnAllReservations()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var restaurantId = Guid.NewGuid();
        var menuId = Guid.NewGuid();
        var mealTimeSlotId = 1;
        var date = DateTime.UtcNow.AddDays(1);

        var reservations = new List<Reservation>
        {
            new Reservation(userId, restaurantId, menuId, mealTimeSlotId, date),
            new Reservation(userId, restaurantId, menuId, mealTimeSlotId, date.AddDays(1))
        };

        _repositoryMock.Setup(r => r.GetAllAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(reservations);

        // Act
        var result = await _service.GetAllReservationsAsync();

        // Assert
        result.Should().NotBeNull();
        result.Should().HaveCount(2);
        _repositoryMock.Verify(r => r.GetAllAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task GetReservationByIdAsync_WhenReservationExists_ShouldReturnReservation()
    {
        // Arrange
        var reservationId = Guid.NewGuid();
        var userId = Guid.NewGuid();
        var restaurantId = Guid.NewGuid();
        var menuId = Guid.NewGuid();
        var mealTimeSlotId = 1;
        var date = DateTime.UtcNow.AddDays(1);

        var reservation = new Reservation(userId, restaurantId, menuId, mealTimeSlotId, date);

        _repositoryMock.Setup(r => r.GetByIdAsync(reservationId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(reservation);

        // Act
        var result = await _service.GetReservationByIdAsync(reservationId);

        // Assert
        result.Should().NotBeNull();
        result.UserId.Should().Be(userId);
        result.RestaurantId.Should().Be(restaurantId);
        result.MenuId.Should().Be(menuId);
        result.MealTimeSlotId.Should().Be(mealTimeSlotId);
        _repositoryMock.Verify(r => r.GetByIdAsync(reservationId, It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task GetReservationByIdAsync_WhenReservationDoesNotExist_ShouldThrowNotFoundException()
    {
        // Arrange
        var reservationId = Guid.NewGuid();

        _repositoryMock.Setup(r => r.GetByIdAsync(reservationId, It.IsAny<CancellationToken>()))
            .ReturnsAsync((Reservation?)null);

        // Act & Assert
        var exception = await Assert.ThrowsAsync<NotFoundException>(() => _service.GetReservationByIdAsync(reservationId));
        exception.Message.Should().Contain($"Reservation with id {reservationId} not found.");
        _repositoryMock.Verify(r => r.GetByIdAsync(reservationId, It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task CreateReservationAsync_ShouldThrowNotImplementedException()
    {
        // Arrange
        var createDto = new CreateReservationDto
        {
            CustomerName = "John Doe",
            Date = DateTime.UtcNow.AddDays(1),
            Guests = 2
        };

        // Act & Assert
        await Assert.ThrowsAsync<NotImplementedException>(() => _service.CreateReservationAsync(createDto));
    }
}

