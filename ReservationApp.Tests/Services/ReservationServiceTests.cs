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
    private readonly Mock<ISettingService> _settingServiceMock;
    private readonly Mock<IUserRepository> _userRepositoryMock;
    private readonly ReservationService _service;

    public ReservationServiceTests()
    {
        _repositoryMock = new Mock<IReservationRepository>();
        _settingServiceMock = new Mock<ISettingService>();
        _userRepositoryMock = new Mock<IUserRepository>();
        _service = new ReservationService(_repositoryMock.Object, _settingServiceMock.Object, _userRepositoryMock.Object);
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
    public async Task CreateAsync_WhenWeeklyLimitExceeded_ShouldThrowWeeklyLimitExceededException()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var user = new User("Test User", "test@example.com", "hash", UserRole.User);
        var createDto = new CreateReservationDto
        {
            RestaurantId = Guid.NewGuid(),
            MenuId = Guid.NewGuid(),
            MealTimeSlotId = 1,
            Date = DateTime.UtcNow.AddDays(1),
            Appetizer = false
        };

        _userRepositoryMock.Setup(u => u.GetByIdAsync(userId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(user);
        _settingServiceMock.Setup(s => s.GetAllowPastReservationsAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(false);
        _settingServiceMock.Setup(s => s.GetMaxWeeklyReservationsAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(2);
        _repositoryMock.Setup(r => r.HasReservationForDayAsync(userId, It.IsAny<DateOnly>(), It.IsAny<int>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(false);
        
        var weekStart = DateOnly.FromDateTime(createDto.Date.Date.AddDays(-(int)createDto.Date.DayOfWeek + 1));
        var weekEnd = weekStart.AddDays(6);
        _repositoryMock.Setup(r => r.CountReservationsThisWeekAsync(userId, weekStart, weekEnd, It.IsAny<CancellationToken>()))
            .ReturnsAsync(2); // Already at limit

        // Act & Assert
        var exception = await Assert.ThrowsAsync<WeeklyLimitExceededException>(() => 
            _service.CreateAsync(createDto, userId));
        exception.Message.Should().Contain("weekly reservation limit");
    }

    [Fact]
    public async Task CreateAsync_WhenDuplicateReservation_ShouldThrowDuplicateReservationException()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var user = new User("Test User", "test@example.com", "hash", UserRole.User);
        var createDto = new CreateReservationDto
        {
            RestaurantId = Guid.NewGuid(),
            MenuId = Guid.NewGuid(),
            MealTimeSlotId = 1,
            Date = DateTime.UtcNow.AddDays(1),
            Appetizer = false
        };

        _userRepositoryMock.Setup(u => u.GetByIdAsync(userId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(user);
        _settingServiceMock.Setup(s => s.GetAllowPastReservationsAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(false);
        _settingServiceMock.Setup(s => s.GetMaxWeeklyReservationsAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(2);
        _repositoryMock.Setup(r => r.HasReservationForDayAsync(userId, It.IsAny<DateOnly>(), It.IsAny<int>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(true); // Duplicate exists

        // Act & Assert
        var exception = await Assert.ThrowsAsync<DuplicateReservationException>(() => 
            _service.CreateAsync(createDto, userId));
        exception.Message.Should().Contain("already have a reservation");
    }

    [Fact]
    public async Task CreateAsync_WhenPastDate_ShouldThrowInvalidReservationDateException()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var user = new User("Test User", "test@example.com", "hash", UserRole.User);
        var createDto = new CreateReservationDto
        {
            RestaurantId = Guid.NewGuid(),
            MenuId = Guid.NewGuid(),
            MealTimeSlotId = 1,
            Date = DateTime.UtcNow.AddDays(-1), // Past date
            Appetizer = false
        };

        _userRepositoryMock.Setup(u => u.GetByIdAsync(userId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(user);
        _settingServiceMock.Setup(s => s.GetAllowPastReservationsAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(false);

        // Act & Assert
        var exception = await Assert.ThrowsAsync<InvalidReservationDateException>(() => 
            _service.CreateAsync(createDto, userId));
        exception.Message.Should().Contain("in the past");
    }

    [Fact]
    public async Task CreateAsync_WhenAdmin_ShouldBypassWeeklyLimit()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var user = new User("Admin User", "admin@example.com", "hash", UserRole.Admin);
        var createDto = new CreateReservationDto
        {
            RestaurantId = Guid.NewGuid(),
            MenuId = Guid.NewGuid(),
            MealTimeSlotId = 1,
            Date = DateTime.UtcNow.AddDays(1),
            Appetizer = false
        };

        _userRepositoryMock.Setup(u => u.GetByIdAsync(userId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(user);
        _settingServiceMock.Setup(s => s.GetAllowPastReservationsAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(false);
        _repositoryMock.Setup(r => r.HasReservationForDayAsync(userId, It.IsAny<DateOnly>(), It.IsAny<int>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(false);
        
        Reservation? capturedReservation = null;
        _repositoryMock.Setup(r => r.AddAsync(It.IsAny<Reservation>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((Reservation r, CancellationToken ct) =>
            {
                capturedReservation = r;
                return r;
            })
            .Callback<Reservation, CancellationToken>((r, ct) => capturedReservation = r);
        
        _repositoryMock.Setup(r => r.GetByIdAsync(It.IsAny<Guid>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((Guid id, CancellationToken ct) => capturedReservation);

        // Act
        var result = await _service.CreateAsync(createDto, userId);

        // Assert
        result.Should().NotBeNull();
        result.UserId.Should().Be(userId);
        // Verify weekly limit check was NOT called for admin
        _repositoryMock.Verify(r => r.CountReservationsThisWeekAsync(It.IsAny<Guid>(), It.IsAny<DateOnly>(), It.IsAny<DateOnly>(), It.IsAny<CancellationToken>()), Times.Never);
    }

    [Fact]
    public async Task CreateAsync_WhenValid_ShouldCreateReservation()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var user = new User("Test User", "test@example.com", "hash", UserRole.User);
        var createDto = new CreateReservationDto
        {
            RestaurantId = Guid.NewGuid(),
            MenuId = Guid.NewGuid(),
            MealTimeSlotId = 1,
            Date = DateTime.UtcNow.AddDays(1),
            Appetizer = false
        };

        var reservation = new Reservation(userId, createDto.RestaurantId, createDto.MenuId, createDto.MealTimeSlotId, createDto.Date, createDto.Appetizer);

        _userRepositoryMock.Setup(u => u.GetByIdAsync(userId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(user);
        _settingServiceMock.Setup(s => s.GetAllowPastReservationsAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(false);
        _settingServiceMock.Setup(s => s.GetMaxWeeklyReservationsAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(2);
        _repositoryMock.Setup(r => r.HasReservationForDayAsync(userId, It.IsAny<DateOnly>(), It.IsAny<int>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(false);
        
        var weekStart = DateOnly.FromDateTime(createDto.Date.Date.AddDays(-(int)createDto.Date.DayOfWeek + 1));
        var weekEnd = weekStart.AddDays(6);
        _repositoryMock.Setup(r => r.CountReservationsThisWeekAsync(userId, weekStart, weekEnd, It.IsAny<CancellationToken>()))
            .ReturnsAsync(0);
        
        Reservation? capturedReservation = null;
        _repositoryMock.Setup(r => r.AddAsync(It.IsAny<Reservation>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((Reservation r, CancellationToken ct) =>
            {
                capturedReservation = r;
                return r;
            })
            .Callback<Reservation, CancellationToken>((r, ct) => capturedReservation = r);
        
        _repositoryMock.Setup(r => r.GetByIdAsync(It.IsAny<Guid>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((Guid id, CancellationToken ct) => capturedReservation);

        // Act
        var result = await _service.CreateAsync(createDto, userId);

        // Assert
        result.Should().NotBeNull();
        result.UserId.Should().Be(userId);
        result.RestaurantId.Should().Be(createDto.RestaurantId);
        result.MenuId.Should().Be(createDto.MenuId);
        result.MealTimeSlotId.Should().Be(createDto.MealTimeSlotId);
        _repositoryMock.Verify(r => r.AddAsync(It.IsAny<Reservation>(), It.IsAny<CancellationToken>()), Times.Once);
        _repositoryMock.Verify(r => r.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task GetMyReservationsAsync_ShouldReturnUserReservations()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var reservations = new List<Reservation>
        {
            new Reservation(userId, Guid.NewGuid(), Guid.NewGuid(), 1, DateTime.UtcNow.AddDays(1)),
            new Reservation(userId, Guid.NewGuid(), Guid.NewGuid(), 2, DateTime.UtcNow.AddDays(2))
        };

        _repositoryMock.Setup(r => r.GetUserReservationsAsync(userId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(reservations);

        // Act
        var result = await _service.GetMyReservationsAsync(userId);

        // Assert
        result.Should().NotBeNull();
        result.Should().HaveCount(2);
        _repositoryMock.Verify(r => r.GetUserReservationsAsync(userId, It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task CancelAsync_WhenNotOwner_ShouldThrowBadRequestException()
    {
        // Arrange
        var reservationId = Guid.NewGuid();
        var userId = Guid.NewGuid();
        var otherUserId = Guid.NewGuid();

        _repositoryMock.Setup(r => r.GetUserReservationByIdAsync(reservationId, userId, It.IsAny<CancellationToken>()))
            .ReturnsAsync((Reservation?)null);
        _repositoryMock.Setup(r => r.GetByIdAsync(reservationId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(new Reservation(otherUserId, Guid.NewGuid(), Guid.NewGuid(), 1, DateTime.UtcNow.AddDays(1)));

        // Act & Assert
        var exception = await Assert.ThrowsAsync<BadRequestException>(() => 
            _service.CancelAsync(reservationId, userId));
        exception.Message.Should().Contain("only cancel your own");
    }

    [Fact]
    public async Task CancelAsync_WhenValid_ShouldCancelReservation()
    {
        // Arrange
        var reservationId = Guid.NewGuid();
        var userId = Guid.NewGuid();
        var reservation = new Reservation(userId, Guid.NewGuid(), Guid.NewGuid(), 1, DateTime.UtcNow.AddDays(1));

        _repositoryMock.Setup(r => r.GetUserReservationByIdAsync(reservationId, userId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(reservation);
        _repositoryMock.Setup(r => r.SaveChangesAsync(It.IsAny<CancellationToken>()))
            .Returns(Task.CompletedTask);

        // Act
        await _service.CancelAsync(reservationId, userId);

        // Assert
        reservation.Status.Should().Be(ReservationStatus.Cancelled);
        _repositoryMock.Verify(r => r.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }
}

