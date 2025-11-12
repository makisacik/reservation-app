using ReservationApp.Application.DTOs;
using ReservationApp.Application.Interfaces;
using ReservationApp.Domain.Entities;
using ReservationApp.Domain.Enums;
using ReservationApp.Domain.Exceptions;

namespace ReservationApp.Application.Services;

public class ReservationService : IReservationService
{
    private readonly IReservationRepository _reservationRepository;
    private readonly ISettingService _settingService;
    private readonly IUserRepository _userRepository;
    private readonly IEmailNotificationService _emailNotificationService;

    public ReservationService(
        IReservationRepository reservationRepository,
        ISettingService settingService,
        IUserRepository userRepository,
        IEmailNotificationService emailNotificationService)
    {
        _reservationRepository = reservationRepository;
        _settingService = settingService;
        _userRepository = userRepository;
        _emailNotificationService = emailNotificationService;
    }

    public async Task<IEnumerable<ReservationDto>> GetAllReservationsAsync(CancellationToken cancellationToken = default)
    {
        var reservations = await _reservationRepository.GetAllAsync(cancellationToken);
        return reservations.Select(MapToDto);
    }

    public async Task<PaginatedResult<ReservationDto>> GetReservationsAsync(ReservationQueryParams query, CancellationToken cancellationToken = default)
    {
        var paginatedResult = await _reservationRepository.GetPaginatedAsync(query, cancellationToken);
        
        return new PaginatedResult<ReservationDto>
        {
            Page = paginatedResult.Page,
            PageSize = paginatedResult.PageSize,
            TotalCount = paginatedResult.TotalCount,
            TotalPages = paginatedResult.TotalPages,
            Data = paginatedResult.Data.Select(MapToDto)
        };
    }

    public async Task<PaginatedResult<ReservationDto>> GetAdminFilteredAsync(AdminReservationQueryParams query, CancellationToken cancellationToken = default)
    {
        var paginatedResult = await _reservationRepository.GetAdminFilteredAsync(query, cancellationToken);
        
        return new PaginatedResult<ReservationDto>
        {
            Page = paginatedResult.Page,
            PageSize = paginatedResult.PageSize,
            TotalCount = paginatedResult.TotalCount,
            TotalPages = paginatedResult.TotalPages,
            Data = paginatedResult.Data.Select(MapToDto)
        };
    }

    public async Task<ReservationDto> GetReservationByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var reservation = await _reservationRepository.GetByIdAsync(id, cancellationToken);
        if (reservation == null)
        {
            throw new NotFoundException($"Reservation with id {id} not found.");
        }

        return MapToDto(reservation);
    }

    public async Task<ReservationDto> CreateAsync(CreateReservationDto dto, Guid userId, CancellationToken cancellationToken = default)
    {
        // Get user to check role
        var user = await _userRepository.GetByIdAsync(userId, cancellationToken);
        if (user == null)
        {
            throw new NotFoundException($"User with id {userId} not found.");
        }

        var isAdmin = user.Role == UserRole.Admin;

        // Get settings using category-based methods
        var allowPastReservationsResult = await _settingService.GetValueAsync<bool?>("Reservation", "AllowPastReservations", null, cancellationToken);
        var allowPastReservations = allowPastReservationsResult ?? false;
        var maxWeeklyReservationsResult = await _settingService.GetValueAsync<int?>("Reservation", "MaxWeeklyReservations", null, cancellationToken);
        var maxWeeklyReservations = maxWeeklyReservationsResult ?? 2;

        // Check past date (unless admin or setting allows)
        if (!isAdmin && !allowPastReservations && dto.Date.Date < DateTime.UtcNow.Date)
        {
            throw new InvalidReservationDateException(dto.Date);
        }

        // Check duplicate reservation (same user, date, meal time slot)
        var reservationDate = DateOnly.FromDateTime(dto.Date);
        var hasDuplicate = await _reservationRepository.HasReservationForDayAsync(userId, reservationDate, dto.MealTimeSlotId, cancellationToken);
        if (hasDuplicate)
        {
            // Get meal time slot name for error message
            var existingReservation = await _reservationRepository.GetUserReservationsAsync(userId, cancellationToken);
            var duplicate = existingReservation.FirstOrDefault(r => 
                DateOnly.FromDateTime(r.Date) == reservationDate && r.MealTimeSlotId == dto.MealTimeSlotId);
            var mealTimeSlotName = duplicate?.MealTimeSlot?.Name ?? "the selected time slot";
            throw new DuplicateReservationException(dto.Date, mealTimeSlotName);
        }

        // Check weekly limit (unless admin)
        if (!isAdmin)
        {
            // Calculate week start (Monday) and end (Sunday) using ISO 8601
            var date = dto.Date.Date;
            var dayOfWeek = (int)date.DayOfWeek;
            var daysFromMonday = dayOfWeek == 0 ? 6 : dayOfWeek - 1; // Sunday = 0, convert to Monday = 0
            var weekStart = DateOnly.FromDateTime(date.AddDays(-daysFromMonday));
            var weekEnd = weekStart.AddDays(6);

            var currentWeekCount = await _reservationRepository.CountReservationsThisWeekAsync(userId, weekStart, weekEnd, cancellationToken);
            if (currentWeekCount >= maxWeeklyReservations)
            {
                throw new WeeklyLimitExceededException(maxWeeklyReservations, currentWeekCount);
            }
        }

        // Create reservation
        var reservation = new Reservation(
            userId,
            dto.RestaurantId,
            dto.MenuId,
            dto.MealTimeSlotId,
            dto.Date,
            dto.Appetizer
        );

        await _reservationRepository.AddAsync(reservation, cancellationToken);
        await _reservationRepository.SaveChangesAsync(cancellationToken);

        // Reload with navigation properties
        var createdReservation = await _reservationRepository.GetByIdAsync(reservation.Id, cancellationToken);
        if (createdReservation == null)
        {
            throw new DomainException("Failed to retrieve created reservation.");
        }

        // Send confirmation email (fire-and-forget)
        _ = Task.Run(async () =>
        {
            try
            {
                await _emailNotificationService.SendReservationConfirmationAsync(user, createdReservation, cancellationToken);
            }
            catch
            {
                // Log but don't throw - email failures shouldn't break reservation creation
                // EmailNotificationService handles its own logging
            }
        }, cancellationToken);

        return MapToDto(createdReservation);
    }

    public async Task<IEnumerable<ReservationDto>> GetMyReservationsAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var reservations = await _reservationRepository.GetUserReservationsAsync(userId, cancellationToken);
        return reservations.Select(MapToDto);
    }

    public async Task CancelAsync(Guid reservationId, Guid userId, CancellationToken cancellationToken = default)
    {
        var reservation = await _reservationRepository.GetUserReservationByIdAsync(reservationId, userId, cancellationToken);
        if (reservation == null)
        {
            // Check if reservation exists but belongs to another user
            var anyReservation = await _reservationRepository.GetByIdAsync(reservationId, cancellationToken);
            if (anyReservation != null)
            {
                throw new BadRequestException("You can only cancel your own reservations.");
            }
            throw new NotFoundException($"Reservation with id {reservationId} not found.");
        }

        // Only allow cancellation of future reservations
        if (reservation.Date.Date < DateTime.UtcNow.Date)
        {
            throw new BadRequestException("Cannot cancel past reservations.");
        }

        // Check if already cancelled
        if (reservation.Status == ReservationStatus.Cancelled)
        {
            throw new BadRequestException("Reservation is already cancelled.");
        }

        reservation.Cancel();
        await _reservationRepository.SaveChangesAsync(cancellationToken);
    }

    public async Task AdminCancelAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var reservation = await _reservationRepository.GetByIdAsync(id, cancellationToken);
        if (reservation == null)
        {
            throw new NotFoundException($"Reservation with id {id} not found.");
        }

        // Check if already cancelled
        if (reservation.Status == ReservationStatus.Cancelled)
        {
            throw new BadRequestException("Reservation is already cancelled.");
        }

        // Admin can cancel any reservation (no date restrictions)
        reservation.Cancel();
        await _reservationRepository.SaveChangesAsync(cancellationToken);
    }

    private static ReservationDto MapToDto(Reservation reservation)
    {
        return new ReservationDto
        {
            Id = reservation.Id,
            UserId = reservation.UserId,
            UserName = reservation.User?.Name ?? string.Empty,
            RestaurantId = reservation.RestaurantId,
            RestaurantName = reservation.Restaurant?.Name ?? string.Empty,
            MenuId = reservation.MenuId,
            MenuDate = reservation.Menu?.Date ?? reservation.Date,
            MealTimeSlotId = reservation.MealTimeSlotId,
            MealTimeSlotName = reservation.MealTimeSlot?.Name ?? string.Empty,
            Date = reservation.Date,
            Appetizer = reservation.Appetizer,
            Status = reservation.Status,
            CreatedAt = reservation.CreatedAt,
            UpdatedAt = reservation.UpdatedAt
        };
    }
}
