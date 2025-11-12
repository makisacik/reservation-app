using FluentAssertions;
using Microsoft.Extensions.Configuration;
using Moq;
using ReservationApp.Application.DTOs;
using ReservationApp.Application.Interfaces;
using ReservationApp.Application.Services;
using ReservationApp.Domain.Entities;
using ReservationApp.Domain.Enums;
using ReservationApp.Domain.Exceptions;
using Xunit;

namespace ReservationApp.Tests.Services;

public class UserServiceTests
{
    private readonly Mock<IUserRepository> _repositoryMock;
    private readonly Mock<IConfiguration> _configurationMock;
    private readonly UserService _service;

    public UserServiceTests()
    {
        _repositoryMock = new Mock<IUserRepository>();
        _configurationMock = new Mock<IConfiguration>();
        _configurationMock.Setup(c => c["Jwt:Key"]).Returns("test-key-that-is-long-enough-for-hmac-sha256");
        _configurationMock.Setup(c => c["Jwt:Issuer"]).Returns("test-issuer");
        _configurationMock.Setup(c => c["Jwt:Audience"]).Returns("test-audience");
        _service = new UserService(_repositoryMock.Object, _configurationMock.Object);
    }

    [Fact]
    public async Task GetFilteredAsync_ShouldReturnPaginatedUsers()
    {
        // Arrange
        var filter = new UserFilterDto
        {
            Page = 1,
            PageSize = 10,
            Search = "test"
        };

        var users = new List<User>
        {
            new User("Test User", "test@example.com", "hash", UserRole.User),
            new User("Test Admin", "admin@example.com", "hash", UserRole.Admin)
        };

        var paginatedResult = new PaginatedResult<User>
        {
            Page = 1,
            PageSize = 10,
            TotalCount = 2,
            TotalPages = 1,
            Data = users
        };

        _repositoryMock.Setup(r => r.GetFilteredAsync(filter, It.IsAny<CancellationToken>()))
            .ReturnsAsync(paginatedResult);

        // Act
        var result = await _service.GetFilteredAsync(filter);

        // Assert
        result.Should().NotBeNull();
        result.Page.Should().Be(1);
        result.PageSize.Should().Be(10);
        result.TotalCount.Should().Be(2);
        result.Data.Should().HaveCount(2);
    }

    [Fact]
    public async Task UpdateAsync_ShouldUpdateUser()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var user = new User("Old Name", "test@example.com", "hash", UserRole.User, "Old Department");
        var updateDto = new UserUpdateDto
        {
            Name = "New Name",
            Department = "New Department",
            Role = UserRole.Admin,
            Status = UserStatus.Active
        };

        _repositoryMock.Setup(r => r.GetByIdAsync(userId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(user);
        _repositoryMock.Setup(r => r.SaveChangesAsync(It.IsAny<CancellationToken>()))
            .Returns(Task.CompletedTask);

        // Act
        var result = await _service.UpdateAsync(userId, updateDto);

        // Assert
        result.Should().NotBeNull();
        result.Name.Should().Be("New Name");
        result.Department.Should().Be("New Department");
        result.Role.Should().Be(UserRole.Admin);
        _repositoryMock.Verify(r => r.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task UpdateAsync_ShouldThrowNotFoundException_WhenUserNotFound()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var updateDto = new UserUpdateDto
        {
            Name = "New Name",
            Department = "New Department",
            Role = UserRole.Admin,
            Status = UserStatus.Active
        };

        _repositoryMock.Setup(r => r.GetByIdAsync(userId, It.IsAny<CancellationToken>()))
            .ReturnsAsync((User?)null);

        // Act
        var act = async () => await _service.UpdateAsync(userId, updateDto);

        // Assert
        await act.Should().ThrowAsync<NotFoundException>()
            .WithMessage($"User with id {userId} not found.");
    }

    [Fact]
    public async Task ToggleStatusAsync_ShouldToggleStatus()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var user = new User("Test User", "test@example.com", "hash", UserRole.User);
        var initialStatus = user.Status;

        _repositoryMock.Setup(r => r.GetByIdAsync(userId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(user);
        _repositoryMock.Setup(r => r.SaveChangesAsync(It.IsAny<CancellationToken>()))
            .Returns(Task.CompletedTask);

        // Act
        var result = await _service.ToggleStatusAsync(userId);

        // Assert
        result.Should().NotBeNull();
        result.Status.Should().NotBe(initialStatus);
        _repositoryMock.Verify(r => r.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task ToggleStatusAsync_ShouldThrowNotFoundException_WhenUserNotFound()
    {
        // Arrange
        var userId = Guid.NewGuid();

        _repositoryMock.Setup(r => r.GetByIdAsync(userId, It.IsAny<CancellationToken>()))
            .ReturnsAsync((User?)null);

        // Act
        var act = async () => await _service.ToggleStatusAsync(userId);

        // Assert
        await act.Should().ThrowAsync<NotFoundException>()
            .WithMessage($"User with id {userId} not found.");
    }
}

