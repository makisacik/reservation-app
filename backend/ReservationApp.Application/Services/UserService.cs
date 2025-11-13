using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using ReservationApp.Application.DTOs;
using ReservationApp.Application.Interfaces;
using ReservationApp.Domain.Entities;
using ReservationApp.Domain.Enums;
using ReservationApp.Domain.Exceptions;

namespace ReservationApp.Application.Services;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;
    private readonly IReportRepository _reportRepository;
    private readonly IConfiguration _configuration;

    public UserService(IUserRepository userRepository, IReportRepository reportRepository, IConfiguration configuration)
    {
        _userRepository = userRepository;
        _reportRepository = reportRepository;
        _configuration = configuration;
    }

    public async Task<UserDto> RegisterAsync(RegisterRequestDto request, CancellationToken cancellationToken = default)
    {
        if (await _userRepository.ExistsByEmailAsync(request.Email, cancellationToken))
        {
            throw new BadRequestException("User with this email already exists.");
        }

        var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
        var user = new User(request.Name, request.Email, passwordHash, UserRole.User);

        await _userRepository.AddAsync(user, cancellationToken);
        await _userRepository.SaveChangesAsync(cancellationToken);

        return MapToDto(user);
    }

    public async Task<AuthResponseDto?> LoginAsync(LoginRequestDto request, CancellationToken cancellationToken = default)
    {
        var user = await _userRepository.GetByEmailAsync(request.Email, cancellationToken);
        if (user == null)
        {
            return null;
        }

        if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            return null;
        }

        var token = GenerateJwtToken(user);
        return new AuthResponseDto(token);
    }

    public async Task<UserDto> GetUserByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var user = await _userRepository.GetByIdAsync(id, cancellationToken);
        if (user == null)
        {
            throw new NotFoundException($"User with id {id} not found.");
        }

        var dto = MapToDto(user);
        // Get reservation count for this user
        var counts = await _userRepository.GetReservationCountsAsync(new List<Guid> { id }, cancellationToken);
        dto.TotalReservations = counts.GetValueOrDefault(id, 0);
        return dto;
    }

    public async Task<IEnumerable<UserDto>> GetAllUsersAsync(CancellationToken cancellationToken = default)
    {
        var users = await _userRepository.GetAllAsync(cancellationToken);
        return users.Select(MapToDto);
    }

    public async Task<PaginatedResult<UserDto>> GetFilteredAsync(UserFilterDto filter, CancellationToken cancellationToken = default)
    {
        var paginatedResult = await _userRepository.GetFilteredAsync(filter, cancellationToken);
        
        // Get reservation counts for each user
        var userIds = paginatedResult.Data.Select(u => u.Id).ToList();
        var reservationCounts = await _userRepository.GetReservationCountsAsync(userIds, cancellationToken);
        
        return new PaginatedResult<UserDto>
        {
            Page = paginatedResult.Page,
            PageSize = paginatedResult.PageSize,
            TotalCount = paginatedResult.TotalCount,
            TotalPages = paginatedResult.TotalPages,
            Data = paginatedResult.Data.Select(u => 
            {
                var dto = MapToDto(u);
                dto.TotalReservations = reservationCounts.GetValueOrDefault(u.Id, 0);
                return dto;
            })
        };
    }

    public async Task<UserDto> UpdateAsync(Guid id, UserUpdateDto dto, CancellationToken cancellationToken = default)
    {
        var user = await _userRepository.GetByIdAsync(id, cancellationToken);
        if (user == null)
        {
            throw new NotFoundException($"User with id {id} not found.");
        }

        // Update profile (name, department)
        user.UpdateProfile(dto.Name, dto.Department);

        // Update role if changed
        if (user.Role != dto.Role)
        {
            user.UpdateRole(dto.Role);
        }

        // Update status if changed
        if (user.Status != dto.Status)
        {
            user.UpdateStatus(dto.Status);
        }

        await _userRepository.SaveChangesAsync(cancellationToken);

        return MapToDto(user);
    }

    public async Task<UserDto> ToggleStatusAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var user = await _userRepository.GetByIdAsync(id, cancellationToken);
        if (user == null)
        {
            throw new NotFoundException($"User with id {id} not found.");
        }

        // Toggle status: Active -> Passive, Passive -> Active
        var newStatus = user.Status == UserStatus.Active ? UserStatus.Passive : UserStatus.Active;
        user.UpdateStatus(newStatus);

        await _userRepository.SaveChangesAsync(cancellationToken);

        return MapToDto(user);
    }

    public async Task<UserDto> UpdateUserRoleAsync(Guid userId, UserRole newRole, CancellationToken cancellationToken = default)
    {
        var user = await _userRepository.GetByIdAsync(userId, cancellationToken);
        if (user == null)
        {
            throw new NotFoundException($"User with id {userId} not found.");
        }

        user.UpdateRole(newRole);
        await _userRepository.SaveChangesAsync(cancellationToken);

        return MapToDto(user);
    }

    public async Task<UserStatisticsDto> GetUserStatisticsAsync(CancellationToken cancellationToken = default)
    {
        var totalUsers = await _reportRepository.CountUsersAsync(cancellationToken);
        var activeUsers = await _reportRepository.CountActiveUsersAsync(cancellationToken);
        var passiveUsers = await _reportRepository.CountPassiveUsersAsync(cancellationToken);
        var newThisMonth = await _reportRepository.CountNewUsersThisMonthAsync(cancellationToken);

        return new UserStatisticsDto
        {
            TotalUsers = totalUsers,
            ActiveUsers = activeUsers,
            PassiveUsers = passiveUsers,
            NewThisMonth = newThisMonth
        };
    }

    public async Task<UserDto> UpdateCurrentUserProfileAsync(Guid userId, UpdateProfileDto dto, CancellationToken cancellationToken = default)
    {
        var user = await _userRepository.GetByIdAsync(userId, cancellationToken);
        if (user == null)
        {
            throw new NotFoundException($"User with id {userId} not found.");
        }

        // Only update name and department (users cannot update their own role or status)
        user.UpdateProfile(dto.Name, dto.Department);

        await _userRepository.SaveChangesAsync(cancellationToken);

        return MapToDto(user);
    }

    public async Task<UserDto> CreateUserAsync(AdminCreateUserDto request, CancellationToken cancellationToken = default)
    {
        if (await _userRepository.ExistsByEmailAsync(request.Email, cancellationToken))
        {
            throw new BadRequestException("User with this email already exists.");
        }

        var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
        // New users are created as Active by default
        var user = new User(request.Name, request.Email, passwordHash, request.Role, request.Department, UserStatus.Active);

        await _userRepository.AddAsync(user, cancellationToken);
        await _userRepository.SaveChangesAsync(cancellationToken);

        return MapToDto(user);
    }

    private string GenerateJwtToken(User user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role.ToString()),
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
        };

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(12),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private static UserDto MapToDto(User user)
    {
        return new UserDto
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            Department = user.Department,
            Role = user.Role,
            Status = user.Status,
            CreatedAt = user.CreatedAt
        };
    }
}

