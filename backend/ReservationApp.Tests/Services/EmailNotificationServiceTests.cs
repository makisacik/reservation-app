using FluentAssertions;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Moq;
using ReservationApp.Application.Interfaces;
using ReservationApp.Application.Services;
using ReservationApp.Domain.Entities;
using ReservationApp.Domain.Enums;
using Xunit;

namespace ReservationApp.Tests.Services;

public class EmailNotificationServiceTests
{
    private readonly Mock<ISettingService> _settingServiceMock;
    private readonly Mock<IConfiguration> _configurationMock;
    private readonly Mock<ILogger<EmailNotificationService>> _loggerMock;
    private readonly EmailNotificationService _service;

    public EmailNotificationServiceTests()
    {
        _settingServiceMock = new Mock<ISettingService>();
        _configurationMock = new Mock<IConfiguration>();
        _loggerMock = new Mock<ILogger<EmailNotificationService>>();

        // Setup default configuration
        _configurationMock.Setup(c => c["Smtp:Host"]).Returns("smtp.test.com");
        _configurationMock.Setup(c => c["Smtp:Port"]).Returns("587");
        _configurationMock.Setup(c => c["Smtp:FromEmail"]).Returns("test@example.com");
        _configurationMock.Setup(c => c["Smtp:FromName"]).Returns("Test App");

        _service = new EmailNotificationService(_settingServiceMock.Object, _configurationMock.Object, _loggerMock.Object);
    }

    [Fact]
    public async Task SendReservationConfirmationAsync_WhenEmailEnabled_ShouldNotThrow()
    {
        // Arrange
        var user = new User("Test User", "test@example.com", "hash", UserRole.User);
        var restaurant = new Restaurant("Test Restaurant");
        var mealTimeSlot = new MealTimeSlot("Lunch", new TimeOnly(12, 0), new TimeOnly(14, 0));
        var menu = new Menu(Guid.NewGuid(), DateTime.UtcNow.AddDays(1), MenuType.Standard);
        var reservation = new Reservation(user.Id, restaurant.Id, menu.Id, mealTimeSlot.Id, DateTime.UtcNow.AddDays(1));

        // Use reflection to set navigation properties
        typeof(Reservation).GetProperty("User")!.SetValue(reservation, user);
        typeof(Reservation).GetProperty("Restaurant")!.SetValue(reservation, restaurant);
        typeof(Reservation).GetProperty("MealTimeSlot")!.SetValue(reservation, mealTimeSlot);
        typeof(Reservation).GetProperty("Menu")!.SetValue(reservation, menu);

        _settingServiceMock.Setup(s => s.GetValueAsync<bool>("Notifications", "EmailEnabled", It.IsAny<bool>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);
        _settingServiceMock.Setup(s => s.GetValueAsync<string>("General", "CompanyName", It.IsAny<string>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync("Test Company");

        // Act
        var act = async () => await _service.SendReservationConfirmationAsync(user, reservation);

        // Assert - Should not throw (even if SMTP fails, it's caught internally)
        await act.Should().NotThrowAsync();
    }

    [Fact]
    public async Task SendReservationConfirmationAsync_WhenEmailDisabled_ShouldNotSend()
    {
        // Arrange
        var user = new User("Test User", "test@example.com", "hash", UserRole.User);
        var restaurant = new Restaurant("Test Restaurant");
        var mealTimeSlot = new MealTimeSlot("Lunch", new TimeOnly(12, 0), new TimeOnly(14, 0));
        var menu = new Menu(Guid.NewGuid(), DateTime.UtcNow.AddDays(1), MenuType.Standard);
        var reservation = new Reservation(user.Id, restaurant.Id, menu.Id, mealTimeSlot.Id, DateTime.UtcNow.AddDays(1));

        _settingServiceMock.Setup(s => s.GetValueAsync<bool>("Notifications", "EmailEnabled", It.IsAny<bool>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(false);

        // Act
        await _service.SendReservationConfirmationAsync(user, reservation);

        // Assert - Should not attempt to send email
        _configurationMock.Verify(c => c["Smtp:Host"], Times.Never);
    }

    [Fact]
    public async Task SendDailyMenuReminderAsync_WhenEmailDisabled_ShouldNotSend()
    {
        // Arrange
        var user = new User("Test User", "test@example.com", "hash", UserRole.User);
        var menus = new List<Menu>();

        _settingServiceMock.Setup(s => s.GetValueAsync<bool>("Notifications", "EmailEnabled", It.IsAny<bool>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(false);

        // Act
        await _service.SendDailyMenuReminderAsync(user, menus);

        // Assert - Should not attempt to send email
        _configurationMock.Verify(c => c["Smtp:Host"], Times.Never);
    }

    [Fact]
    public async Task SendDailyMenuReminderAsync_WhenDailyReminderDisabled_ShouldNotSend()
    {
        // Arrange
        var user = new User("Test User", "test@example.com", "hash", UserRole.User);
        var menus = new List<Menu>();

        _settingServiceMock.Setup(s => s.GetValueAsync<bool>("Notifications", "EmailEnabled", It.IsAny<bool>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);
        _settingServiceMock.Setup(s => s.GetValueAsync<bool>("Notifications", "DailyReminderEnabled", It.IsAny<bool>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(false);

        // Act
        await _service.SendDailyMenuReminderAsync(user, menus);

        // Assert - Should not attempt to send email
        _configurationMock.Verify(c => c["Smtp:Host"], Times.Never);
    }

    [Fact]
    public async Task SendDailyMenuReminderAsync_WhenNoMenus_ShouldNotSend()
    {
        // Arrange
        var user = new User("Test User", "test@example.com", "hash", UserRole.User);
        var menus = new List<Menu>(); // Empty list

        _settingServiceMock.Setup(s => s.GetValueAsync<bool>("Notifications", "EmailEnabled", It.IsAny<bool>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);
        _settingServiceMock.Setup(s => s.GetValueAsync<bool>("Notifications", "DailyReminderEnabled", It.IsAny<bool>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);

        // Act
        await _service.SendDailyMenuReminderAsync(user, menus);

        // Assert - Should not attempt to send email when no menus
        _configurationMock.Verify(c => c["Smtp:Host"], Times.Never);
    }
}

