using FluentAssertions;
using Moq;
using ReservationApp.Application.DTOs;
using ReservationApp.Application.Interfaces;
using ReservationApp.Application.Services;
using ReservationApp.Domain.Entities;
using ReservationApp.Domain.Exceptions;
using Xunit;

namespace ReservationApp.Tests.Services;

public class MealServiceTests
{
    private readonly Mock<IMealRepository> _mealRepositoryMock;
    private readonly Mock<IRestaurantRepository> _restaurantRepositoryMock;
    private readonly MealService _service;

    public MealServiceTests()
    {
        _mealRepositoryMock = new Mock<IMealRepository>();
        _restaurantRepositoryMock = new Mock<IRestaurantRepository>();
        _service = new MealService(_mealRepositoryMock.Object, _restaurantRepositoryMock.Object);
    }

    [Fact]
    public async Task GetByIdAsync_ShouldReturnMeal()
    {
        // Arrange
        var mealId = Guid.NewGuid();
        var categoryId = Guid.NewGuid();
        var restaurantId = Guid.NewGuid();
        var category = new MenuCategory("Test Category");
        var restaurant = new Restaurant("Test Restaurant");
        var meal = new Meal("Test Meal", categoryId, restaurantId, "Description", 500);

        // Use reflection to set private properties for testing
        typeof(Meal).GetProperty("Id")!.SetValue(meal, mealId);
        typeof(Meal).GetProperty("Category")!.SetValue(meal, category);
        typeof(Meal).GetProperty("Restaurant")!.SetValue(meal, restaurant);

        _mealRepositoryMock.Setup(r => r.GetByIdAsync(mealId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(meal);

        // Act
        var result = await _service.GetByIdAsync(mealId);

        // Assert
        result.Should().NotBeNull();
        result.Id.Should().Be(mealId);
        result.Name.Should().Be("Test Meal");
    }

    [Fact]
    public async Task GetByIdAsync_ShouldThrowNotFoundException_WhenMealNotFound()
    {
        // Arrange
        var mealId = Guid.NewGuid();

        _mealRepositoryMock.Setup(r => r.GetByIdAsync(mealId, It.IsAny<CancellationToken>()))
            .ReturnsAsync((Meal?)null);

        // Act
        var act = async () => await _service.GetByIdAsync(mealId);

        // Assert
        await act.Should().ThrowAsync<NotFoundException>()
            .WithMessage($"Meal with id {mealId} not found.");
    }

    [Fact]
    public async Task CreateAsync_ShouldCreateMeal()
    {
        // Arrange
        var categoryId = Guid.NewGuid();
        var restaurantId = Guid.NewGuid();
        var createDto = new MealCreateDto
        {
            Name = "Test Meal",
            Description = "Test Description",
            Kcal = 500,
            CategoryId = categoryId,
            RestaurantId = restaurantId,
            ImageUrl = "https://example.com/image.jpg"
        };

        var restaurant = new Restaurant("Test Restaurant");
        typeof(Restaurant).GetProperty("Id")!.SetValue(restaurant, restaurantId);

        var category = new MenuCategory("Test Category");
        typeof(MenuCategory).GetProperty("Id")!.SetValue(category, categoryId);

        var createdMeal = new Meal(createDto.Name, createDto.CategoryId, createDto.RestaurantId, createDto.Description, createDto.Kcal, createDto.ImageUrl);
        typeof(Meal).GetProperty("Category")!.SetValue(createdMeal, category);
        typeof(Meal).GetProperty("Restaurant")!.SetValue(createdMeal, restaurant);

        _restaurantRepositoryMock.Setup(r => r.GetByIdAsync(restaurantId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(restaurant);
        _mealRepositoryMock.Setup(r => r.CategoryExistsAsync(categoryId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);
        _mealRepositoryMock.Setup(r => r.AddAsync(It.IsAny<Meal>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(createdMeal);
        _mealRepositoryMock.Setup(r => r.SaveChangesAsync(It.IsAny<CancellationToken>()))
            .Returns(Task.CompletedTask);
        _mealRepositoryMock.Setup(r => r.GetByIdAsync(It.IsAny<Guid>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(createdMeal);

        // Act
        var result = await _service.CreateAsync(createDto);

        // Assert
        result.Should().NotBeNull();
        result.Name.Should().Be("Test Meal");
        result.Description.Should().Be("Test Description");
        result.Kcal.Should().Be(500);
        _mealRepositoryMock.Verify(r => r.AddAsync(It.IsAny<Meal>(), It.IsAny<CancellationToken>()), Times.Once);
        _mealRepositoryMock.Verify(r => r.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task CreateAsync_ShouldThrowNotFoundException_WhenRestaurantNotFound()
    {
        // Arrange
        var categoryId = Guid.NewGuid();
        var restaurantId = Guid.NewGuid();
        var createDto = new MealCreateDto
        {
            Name = "Test Meal",
            CategoryId = categoryId,
            RestaurantId = restaurantId
        };

        _restaurantRepositoryMock.Setup(r => r.GetByIdAsync(restaurantId, It.IsAny<CancellationToken>()))
            .ReturnsAsync((Restaurant?)null);

        // Act
        var act = async () => await _service.CreateAsync(createDto);

        // Assert
        await act.Should().ThrowAsync<NotFoundException>()
            .WithMessage($"Restaurant with id {restaurantId} not found.");
    }

    [Fact]
    public async Task CreateAsync_ShouldThrowNotFoundException_WhenCategoryNotFound()
    {
        // Arrange
        var categoryId = Guid.NewGuid();
        var restaurantId = Guid.NewGuid();
        var createDto = new MealCreateDto
        {
            Name = "Test Meal",
            CategoryId = categoryId,
            RestaurantId = restaurantId
        };

        var restaurant = new Restaurant("Test Restaurant");
        typeof(Restaurant).GetProperty("Id")!.SetValue(restaurant, restaurantId);

        _restaurantRepositoryMock.Setup(r => r.GetByIdAsync(restaurantId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(restaurant);
        _mealRepositoryMock.Setup(r => r.CategoryExistsAsync(categoryId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(false);

        // Act
        var act = async () => await _service.CreateAsync(createDto);

        // Assert
        await act.Should().ThrowAsync<NotFoundException>()
            .WithMessage($"Category with id {categoryId} not found.");
    }

    [Fact]
    public async Task UpdateAsync_ShouldUpdateMeal()
    {
        // Arrange
        var mealId = Guid.NewGuid();
        var categoryId = Guid.NewGuid();
        var restaurantId = Guid.NewGuid();
        var category = new MenuCategory("Test Category");
        typeof(MenuCategory).GetProperty("Id")!.SetValue(category, categoryId);
        var restaurant = new Restaurant("Test Restaurant");
        typeof(Restaurant).GetProperty("Id")!.SetValue(restaurant, restaurantId);

        var meal = new Meal("Old Name", categoryId, restaurantId, "Old Description", 400);
        typeof(Meal).GetProperty("Id")!.SetValue(meal, mealId);
        typeof(Meal).GetProperty("Category")!.SetValue(meal, category);
        typeof(Meal).GetProperty("Restaurant")!.SetValue(meal, restaurant);

        var updateDto = new MealUpdateDto
        {
            Name = "New Name",
            Description = "New Description",
            Kcal = 600,
            CategoryId = categoryId,
            ImageUrl = "https://example.com/new-image.jpg"
        };

        _mealRepositoryMock.Setup(r => r.GetByIdAsync(mealId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(meal);
        _mealRepositoryMock.Setup(r => r.CategoryExistsAsync(categoryId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);
        _mealRepositoryMock.Setup(r => r.UpdateAsync(It.IsAny<Meal>(), It.IsAny<CancellationToken>()))
            .Returns(Task.CompletedTask);
        _mealRepositoryMock.Setup(r => r.SaveChangesAsync(It.IsAny<CancellationToken>()))
            .Returns(Task.CompletedTask);
        _mealRepositoryMock.Setup(r => r.GetByIdAsync(mealId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(meal);

        // Act
        var result = await _service.UpdateAsync(mealId, updateDto);

        // Assert
        result.Should().NotBeNull();
        _mealRepositoryMock.Verify(r => r.UpdateAsync(It.IsAny<Meal>(), It.IsAny<CancellationToken>()), Times.Once);
        _mealRepositoryMock.Verify(r => r.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task DeleteAsync_ShouldDeleteMeal()
    {
        // Arrange
        var mealId = Guid.NewGuid();
        var categoryId = Guid.NewGuid();
        var restaurantId = Guid.NewGuid();
        var category = new MenuCategory("Test Category");
        typeof(MenuCategory).GetProperty("Id")!.SetValue(category, categoryId);
        var restaurant = new Restaurant("Test Restaurant");
        typeof(Restaurant).GetProperty("Id")!.SetValue(restaurant, restaurantId);

        var meal = new Meal("Test Meal", categoryId, restaurantId);
        typeof(Meal).GetProperty("Id")!.SetValue(meal, mealId);
        typeof(Meal).GetProperty("Category")!.SetValue(meal, category);
        typeof(Meal).GetProperty("Restaurant")!.SetValue(meal, restaurant);

        _mealRepositoryMock.Setup(r => r.GetByIdAsync(mealId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(meal);
        _mealRepositoryMock.Setup(r => r.DeleteAsync(It.IsAny<Meal>(), It.IsAny<CancellationToken>()))
            .Returns(Task.CompletedTask);
        _mealRepositoryMock.Setup(r => r.SaveChangesAsync(It.IsAny<CancellationToken>()))
            .Returns(Task.CompletedTask);

        // Act
        await _service.DeleteAsync(mealId);

        // Assert
        _mealRepositoryMock.Verify(r => r.DeleteAsync(It.IsAny<Meal>(), It.IsAny<CancellationToken>()), Times.Once);
        _mealRepositoryMock.Verify(r => r.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task DeleteAsync_ShouldThrowNotFoundException_WhenMealNotFound()
    {
        // Arrange
        var mealId = Guid.NewGuid();

        _mealRepositoryMock.Setup(r => r.GetByIdAsync(mealId, It.IsAny<CancellationToken>()))
            .ReturnsAsync((Meal?)null);

        // Act
        var act = async () => await _service.DeleteAsync(mealId);

        // Assert
        await act.Should().ThrowAsync<NotFoundException>()
            .WithMessage($"Meal with id {mealId} not found.");
    }
}

