using FluentAssertions;
using Moq;
using ReservationApp.Application.DTOs;
using ReservationApp.Application.Interfaces;
using ReservationApp.Application.Services;
using ReservationApp.Domain.Entities;
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
        var reservations = new List<Reservation>
        {
            new Reservation("John Doe", DateTime.UtcNow.AddDays(1), 2),
            new Reservation("Jane Smith", DateTime.UtcNow.AddDays(2), 4)
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
        var reservation = new Reservation("John Doe", DateTime.UtcNow.AddDays(1), 2);

        _repositoryMock.Setup(r => r.GetByIdAsync(reservationId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(reservation);

        // Act
        var result = await _service.GetReservationByIdAsync(reservationId);

        // Assert
        result.Should().NotBeNull();
        result.CustomerName.Should().Be("John Doe");
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
    public async Task CreateReservationAsync_ShouldCreateAndReturnReservation()
    {
        // Arrange
        var createDto = new CreateReservationDto
        {
            CustomerName = "John Doe",
            Date = DateTime.UtcNow.AddDays(1),
            Guests = 2
        };

        _repositoryMock.Setup(r => r.AddAsync(It.IsAny<Reservation>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((Reservation r, CancellationToken ct) => r);
        _repositoryMock.Setup(r => r.SaveChangesAsync(It.IsAny<CancellationToken>()))
            .Returns(Task.CompletedTask);

        // Act
        var result = await _service.CreateReservationAsync(createDto);

        // Assert
        result.Should().NotBeNull();
        result.CustomerName.Should().Be(createDto.CustomerName);
        result.Guests.Should().Be(createDto.Guests);
        _repositoryMock.Verify(r => r.AddAsync(It.IsAny<Reservation>(), It.IsAny<CancellationToken>()), Times.Once);
        _repositoryMock.Verify(r => r.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }
}

