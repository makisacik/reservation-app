using ReservationApp.Application.DTOs;
using ReservationApp.Domain.Enums;

namespace ReservationApp.Application.Interfaces;

public interface IUserService
{
    Task<UserDto> RegisterAsync(RegisterRequestDto request, CancellationToken cancellationToken = default);
    Task<AuthResponseDto?> LoginAsync(LoginRequestDto request, CancellationToken cancellationToken = default);
    Task<UserDto> GetUserByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IEnumerable<UserDto>> GetAllUsersAsync(CancellationToken cancellationToken = default);
    Task<PaginatedResult<UserDto>> GetFilteredAsync(UserFilterDto filter, CancellationToken cancellationToken = default);
    Task<UserDto> UpdateAsync(Guid id, UserUpdateDto dto, CancellationToken cancellationToken = default);
    Task<UserDto> ToggleStatusAsync(Guid id, CancellationToken cancellationToken = default);
    Task<UserDto> UpdateUserRoleAsync(Guid userId, UserRole newRole, CancellationToken cancellationToken = default);
    Task<UserStatisticsDto> GetUserStatisticsAsync(CancellationToken cancellationToken = default);
    Task<UserDto> CreateUserAsync(AdminCreateUserDto request, CancellationToken cancellationToken = default);
    Task<UserDto> UpdateCurrentUserProfileAsync(Guid userId, UpdateProfileDto dto, CancellationToken cancellationToken = default);
}

