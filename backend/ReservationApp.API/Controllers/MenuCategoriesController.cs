using Microsoft.AspNetCore.Mvc;
using ReservationApp.Application.Interfaces;

namespace ReservationApp.API.Controllers;

[ApiController]
[Route("api/menu-categories")]
public class MenuCategoriesController : ControllerBase
{
    private readonly IMenuCategoryService _categoryService;
    private readonly ILogger<MenuCategoriesController> _logger;

    public MenuCategoriesController(IMenuCategoryService categoryService, ILogger<MenuCategoriesController> logger)
    {
        _categoryService = categoryService;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult> GetCategories(CancellationToken cancellationToken)
    {
        _logger.LogInformation("Getting all menu categories");
        var categories = await _categoryService.GetAllCategoriesAsync(cancellationToken);
        return Ok(categories);
    }
}

