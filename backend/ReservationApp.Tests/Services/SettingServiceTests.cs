using FluentAssertions;
using Microsoft.Extensions.Caching.Memory;
using Moq;
using ReservationApp.Application.Interfaces;
using ReservationApp.Application.Services;
using ReservationApp.Domain.Entities;
using ReservationApp.Domain.Enums;
using Xunit;

namespace ReservationApp.Tests.Services;

public class SettingServiceTests
{
    private readonly Mock<ISettingRepository> _repositoryMock;
    private readonly IMemoryCache _cache;
    private readonly SettingService _service;

    public SettingServiceTests()
    {
        _repositoryMock = new Mock<ISettingRepository>();
        _cache = new MemoryCache(new MemoryCacheOptions());
        _service = new SettingService(_repositoryMock.Object, _cache);
    }

    [Fact]
    public async Task GetValueAsync_WhenSettingExists_ShouldReturnValue()
    {
        // Arrange
        var category = "Reservation";
        var key = "MaxWeeklyReservations";
        var setting = new SystemSetting(category, key, "3", SettingType.Int);

        _repositoryMock.Setup(r => r.GetByCategoryAndKeyAsync(category, key, It.IsAny<CancellationToken>()))
            .ReturnsAsync(setting);

        // Act
        var result = await _service.GetValueAsync<int>(category, key, 0);

        // Assert
        result.Should().Be(3);
        _repositoryMock.Verify(r => r.GetByCategoryAndKeyAsync(category, key, It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task GetValueAsync_WhenSettingNotFound_ShouldReturnDefaultValue()
    {
        // Arrange
        var category = "Reservation";
        var key = "NonExistentKey";

        _repositoryMock.Setup(r => r.GetByCategoryAndKeyAsync(category, key, It.IsAny<CancellationToken>()))
            .ReturnsAsync((SystemSetting?)null);

        // Act
        var result = await _service.GetValueAsync<int?>(category, key, 5);

        // Assert
        result.Should().Be(5);
    }

    [Fact]
    public async Task GetByCategoryAsync_ShouldReturnDictionaryOfSettings()
    {
        // Arrange
        var category = "General";
        var settings = new List<SystemSetting>
        {
            new SystemSetting(category, "CompanyName", "Toyota ISS", SettingType.String),
            new SystemSetting(category, "Timezone", "Europe/Istanbul", SettingType.String)
        };

        _repositoryMock.Setup(r => r.GetByCategoryAsync(category, It.IsAny<CancellationToken>()))
            .ReturnsAsync(settings);

        // Act
        var result = await _service.GetByCategoryAsync(category);

        // Assert
        result.Should().NotBeNull();
        result.Should().HaveCount(2);
        result.Should().ContainKey("CompanyName");
        result.Should().ContainKey("Timezone");
        result["CompanyName"].Should().Be("Toyota ISS");
        result["Timezone"].Should().Be("Europe/Istanbul");
    }

    [Fact]
    public async Task UpdateCategoryAsync_WhenSettingExists_ShouldUpdateValue()
    {
        // Arrange
        var category = "Reservation";
        var key = "MaxWeeklyReservations";
        var existingSetting = new SystemSetting(category, key, "2", SettingType.Int);
        var values = new Dictionary<string, string> { { key, "5" } };

        _repositoryMock.Setup(r => r.GetByCategoryAndKeysAsync(category, It.IsAny<IEnumerable<string>>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new List<SystemSetting> { existingSetting });
        _repositoryMock.Setup(r => r.UpdateAsync(It.IsAny<SystemSetting>(), It.IsAny<CancellationToken>()))
            .Returns(Task.CompletedTask);
        _repositoryMock.Setup(r => r.SaveChangesAsync(It.IsAny<CancellationToken>()))
            .Returns(Task.CompletedTask);

        // Act
        await _service.UpdateCategoryAsync(category, values);

        // Assert
        _repositoryMock.Verify(r => r.UpdateAsync(It.Is<SystemSetting>(s => s.Key == key), It.IsAny<CancellationToken>()), Times.Once);
        _repositoryMock.Verify(r => r.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task UpdateCategoryAsync_WhenSettingNotExists_ShouldCreateNewSetting()
    {
        // Arrange
        var category = "General";
        var key = "NewSetting";
        var values = new Dictionary<string, string> { { key, "NewValue" } };

        _repositoryMock.Setup(r => r.GetByCategoryAndKeysAsync(category, It.IsAny<IEnumerable<string>>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new List<SystemSetting>());
        _repositoryMock.Setup(r => r.AddAsync(It.IsAny<SystemSetting>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((SystemSetting s, CancellationToken ct) => s);
        _repositoryMock.Setup(r => r.SaveChangesAsync(It.IsAny<CancellationToken>()))
            .Returns(Task.CompletedTask);

        // Act
        await _service.UpdateCategoryAsync(category, values);

        // Assert
        _repositoryMock.Verify(r => r.AddAsync(It.Is<SystemSetting>(s => s.Category == category && s.Key == key), It.IsAny<CancellationToken>()), Times.Once);
        _repositoryMock.Verify(r => r.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task GetValueAsync_ShouldUseCache_OnSecondCall()
    {
        // Arrange
        var category = "Reservation";
        var key = "MaxWeeklyReservations";
        var setting = new SystemSetting(category, key, "3", SettingType.Int);

        _repositoryMock.Setup(r => r.GetByCategoryAndKeyAsync(category, key, It.IsAny<CancellationToken>()))
            .ReturnsAsync(setting);

        // Act - First call
        var result1 = await _service.GetValueAsync<int>(category, key, 0);
        
        // Second call should use cache
        var result2 = await _service.GetValueAsync<int>(category, key, 0);

        // Assert
        result1.Should().Be(3);
        result2.Should().Be(3);
        // Should only call repository once due to caching
        _repositoryMock.Verify(r => r.GetByCategoryAndKeyAsync(category, key, It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task GetMaxWeeklyReservationsAsync_ShouldReturnIntValue()
    {
        // Arrange
        var category = "Reservation";
        var key = "MaxWeeklyReservations";
        var setting = new SystemSetting(category, key, "4", SettingType.Int);

        _repositoryMock.Setup(r => r.GetByCategoryAndKeyAsync(category, key, It.IsAny<CancellationToken>()))
            .ReturnsAsync(setting);

        // Act
        var result = await _service.GetMaxWeeklyReservationsAsync();

        // Assert
        result.Should().Be(4);
        result.Should().BeGreaterThan(0);
    }

    [Fact]
    public async Task GetAllowPastReservationsAsync_ShouldReturnBoolValue()
    {
        // Arrange
        var category = "Reservation";
        var key = "AllowPastReservations";
        var setting = new SystemSetting(category, key, "true", SettingType.Bool);

        _repositoryMock.Setup(r => r.GetByCategoryAndKeyAsync(category, key, It.IsAny<CancellationToken>()))
            .ReturnsAsync(setting);

        // Act
        var result = await _service.GetAllowPastReservationsAsync();

        // Assert
        result.Should().BeTrue();
    }
}

