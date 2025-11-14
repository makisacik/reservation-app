using System;
using Microsoft.Extensions.Logging;
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
    private readonly ITimezoneService _timezoneService;
    private readonly ILogger<ReservationService> _logger;

    public ReservationService(
        IReservationRepository reservationRepository,
        ISettingService settingService,
        IUserRepository userRepository,
        IEmailNotificationService emailNotificationService,
        ITimezoneService timezoneService,
        ILogger<ReservationService> logger)
    {
        _reservationRepository = reservationRepository;
        _settingService = settingService;
        _userRepository = userRepository;
        _emailNotificationService = emailNotificationService;
        _timezoneService = timezoneService;
        _logger = logger;
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
        var user = await _userRepository.GetByIdAsync(userId, cancellationToken);
        if (user == null)
        {
            throw new NotFoundException($"User with id {userId} not found.");
        }

        var isAdmin = user.Role == UserRole.Admin;

        var allowPastReservationsResult = await _settingService.GetValueAsync<bool?>("Reservation", "AllowPastReservations", null, cancellationToken);
        var allowPastReservations = allowPastReservationsResult ?? false;
        var maxWeeklyReservationsResult = await _settingService.GetValueAsync<int?>("Reservation", "MaxWeeklyReservations", null, cancellationToken);
        var maxWeeklyReservations = maxWeeklyReservationsResult ?? 5;

        if (!isAdmin && !allowPastReservations && dto.Date.Date < DateTime.UtcNow.Date)
        {
            throw new InvalidReservationDateException(dto.Date);
        }

        var reservationDate = DateOnly.FromDateTime(dto.Date);
        var hasDuplicate = await _reservationRepository.HasReservationForDayAsync(userId, reservationDate, dto.MealTimeSlotId, cancellationToken);
        if (hasDuplicate)
        {
            var existingReservation = await _reservationRepository.GetUserReservationsAsync(userId, cancellationToken);
            var duplicate = existingReservation.FirstOrDefault(r => 
                DateOnly.FromDateTime(r.Date) == reservationDate && r.MealTimeSlotId == dto.MealTimeSlotId);
            var mealTimeSlotName = duplicate?.MealTimeSlot?.Name ?? "the selected time slot";
            throw new DuplicateReservationException(dto.Date, mealTimeSlotName);
        }

        if (!isAdmin)
        {
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

        _logger.LogInformation("=== SERVICE: CreateAsync START ===");
        _logger.LogInformation("Service - Received DTO: RestaurantId={RestaurantId}, MenuId={MenuId}, MealTimeSlotId={MealTimeSlotId}, Date={Date}, Appetizer={Appetizer}",
            dto.RestaurantId, dto.MenuId, dto.MealTimeSlotId, dto.Date, dto.Appetizer);
        _logger.LogInformation("Service - DTO Date Analysis: Value={Value}, Kind={Kind}, Ticks={Ticks}",
            dto.Date, dto.Date.Kind, dto.Date.Ticks);

        var utcReservationDate = await _timezoneService.ConvertToUtcAsync(dto.Date, cancellationToken);
        _logger.LogInformation("Service - Date converted to UTC: Original={Original}, UTC={Utc}, UTC Kind={UtcKind}",
            dto.Date, utcReservationDate, utcReservationDate.Kind);

        _logger.LogInformation("Service - Final date before entity creation: Value={Value}, Kind={Kind}, Ticks={Ticks}",
            utcReservationDate, utcReservationDate.Kind, utcReservationDate.Ticks);

        _logger.LogInformation("Service - Creating Reservation entity...");
        var reservation = new Reservation(
            userId,
            dto.RestaurantId,
            dto.MenuId,
            dto.MealTimeSlotId,
            utcReservationDate,
            dto.Appetizer
        );
        _logger.LogInformation("Service - Entity created: Id={Id}, Date={Date}, Date Kind={DateKind}, Status={Status}",
            reservation.Id, reservation.Date, reservation.Date.Kind, reservation.Status);

        _logger.LogInformation("Service - Adding to repository...");
        await _reservationRepository.AddAsync(reservation, cancellationToken);
        _logger.LogInformation("Service - Saving changes to database...");
        await _reservationRepository.SaveChangesAsync(cancellationToken);
        _logger.LogInformation("Service - Changes saved successfully");

        var autoApprovalResult = await _settingService.GetValueAsync<bool?>("Reservation", "AutoApproval", null, cancellationToken);
        var autoApproval = autoApprovalResult ?? false;

        if (autoApproval)
        {
            _logger.LogInformation("Service - AutoApproval is enabled, approving reservation {ReservationId}", reservation.Id);
            reservation.Approve();
            await _reservationRepository.SaveChangesAsync(cancellationToken);
            _logger.LogInformation("Service - Reservation {ReservationId} approved automatically", reservation.Id);
        }

        var createdReservation = await _reservationRepository.GetByIdAsync(reservation.Id, cancellationToken);
        if (createdReservation == null)
        {
            throw new DomainException("Failed to retrieve created reservation.");
        }

        if (createdReservation.Status == ReservationStatus.Active)
        {
            _ = Task.Run(async () =>
            {
                try
                {
                    await _emailNotificationService.SendReservationConfirmationAsync(user, createdReservation, cancellationToken);
                }
                catch
                {
                }
            }, cancellationToken);
        }

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
            var anyReservation = await _reservationRepository.GetByIdAsync(reservationId, cancellationToken);
            if (anyReservation != null)
            {
                throw new BadRequestException("You can only cancel your own reservations.");
            }
            throw new NotFoundException($"Reservation with id {reservationId} not found.");
        }

        if (reservation.Date.Date < DateTime.UtcNow.Date)
        {
            throw new BadRequestException("Cannot cancel past reservations.");
        }

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

        if (reservation.Status == ReservationStatus.Cancelled)
        {
            throw new BadRequestException("Reservation is already cancelled.");
        }

        reservation.Cancel();
        await _reservationRepository.SaveChangesAsync(cancellationToken);
    }

    public async Task AdminApproveAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var reservation = await _reservationRepository.GetByIdAsync(id, cancellationToken);
        if (reservation == null)
        {
            throw new NotFoundException($"Reservation with id {id} not found.");
        }

        reservation.Approve();
        await _reservationRepository.SaveChangesAsync(cancellationToken);

        var approvedReservation = await _reservationRepository.GetByIdAsync(id, cancellationToken);
        if (approvedReservation != null && approvedReservation.Status == ReservationStatus.Active)
        {
            var user = approvedReservation.User;
            if (user != null)
            {
                _ = Task.Run(async () =>
                {
                    try
                    {
                        await _emailNotificationService.SendReservationConfirmationAsync(user, approvedReservation, cancellationToken);
                    }
                    catch
                    {
                    }
                }, cancellationToken);
            }
        }
    }

    public async Task<ReservationSummaryDto> GetReservationSummaryAsync(CancellationToken cancellationToken = default)
    {
        var todayCount = await _reservationRepository.CountTodayReservationsAsync(cancellationToken);
        var thisWeekCount = await _reservationRepository.CountThisWeekReservationsAsync(cancellationToken);
        var thisMonthCount = await _reservationRepository.CountThisMonthReservationsAsync(cancellationToken);
        var pendingCount = await _reservationRepository.CountPendingReservationsAsync(cancellationToken);

        return new ReservationSummaryDto
        {
            TodayCount = todayCount,
            ThisWeekCount = thisWeekCount,
            ThisMonthCount = thisMonthCount,
            PendingCount = pendingCount
        };
    }

    public async Task<ReservationDto> AdminCreateAsync(AdminCreateReservationDto dto, CancellationToken cancellationToken = default)
    {
        var user = await _userRepository.GetByIdAsync(dto.UserId, cancellationToken);
        if (user == null)
        {
            throw new NotFoundException($"User with id {dto.UserId} not found.");
        }

        var reservationDate = DateOnly.FromDateTime(dto.Date);
        var hasDuplicate = await _reservationRepository.HasReservationForDayAsync(dto.UserId, reservationDate, dto.MealTimeSlotId, cancellationToken);
        if (hasDuplicate)
        {
            var existingReservation = await _reservationRepository.GetUserReservationsAsync(dto.UserId, cancellationToken);
            var duplicate = existingReservation.FirstOrDefault(r => 
                DateOnly.FromDateTime(r.Date) == reservationDate && r.MealTimeSlotId == dto.MealTimeSlotId);
            var mealTimeSlotName = duplicate?.MealTimeSlot?.Name ?? "the selected time slot";
            throw new DuplicateReservationException(dto.Date, mealTimeSlotName);
        }

        _logger.LogInformation("=== SERVICE: AdminCreateAsync START ===");
        _logger.LogInformation("Service - Received DTO: UserId={UserId}, RestaurantId={RestaurantId}, MenuId={MenuId}, MealTimeSlotId={MealTimeSlotId}, Date={Date}, Appetizer={Appetizer}",
            dto.UserId, dto.RestaurantId, dto.MenuId, dto.MealTimeSlotId, dto.Date, dto.Appetizer);

        var utcReservationDate = await _timezoneService.ConvertToUtcAsync(dto.Date, cancellationToken);
        _logger.LogInformation("Service - Date converted to UTC: Original={Original}, UTC={Utc}, UTC Kind={UtcKind}",
            dto.Date, utcReservationDate, utcReservationDate.Kind);

        _logger.LogInformation("Service - Creating Reservation entity...");
        var reservation = new Reservation(
            dto.UserId,
            dto.RestaurantId,
            dto.MenuId,
            dto.MealTimeSlotId,
            utcReservationDate,
            dto.Appetizer
        );
        _logger.LogInformation("Service - Entity created: Id={Id}, Date={Date}, Date Kind={DateKind}, Status={Status}",
            reservation.Id, reservation.Date, reservation.Date.Kind, reservation.Status);

        _logger.LogInformation("Service - Adding to repository...");
        await _reservationRepository.AddAsync(reservation, cancellationToken);
        _logger.LogInformation("Service - Saving changes to database...");
        await _reservationRepository.SaveChangesAsync(cancellationToken);
        _logger.LogInformation("Service - Changes saved successfully");

        var autoApprovalResult = await _settingService.GetValueAsync<bool?>("Reservation", "AutoApproval", null, cancellationToken);
        var autoApproval = autoApprovalResult ?? false;

        if (autoApproval)
        {
            _logger.LogInformation("Service - AutoApproval is enabled, approving reservation {ReservationId}", reservation.Id);
            reservation.Approve();
            await _reservationRepository.SaveChangesAsync(cancellationToken);
            _logger.LogInformation("Service - Reservation {ReservationId} approved automatically", reservation.Id);
        }

        var createdReservation = await _reservationRepository.GetByIdAsync(reservation.Id, cancellationToken);
        if (createdReservation == null)
        {
            throw new DomainException("Failed to retrieve created reservation.");
        }

        if (createdReservation.Status == ReservationStatus.Active)
        {
            _ = Task.Run(async () =>
            {
                try
                {
                    await _emailNotificationService.SendReservationConfirmationAsync(user, createdReservation, cancellationToken);
                }
                catch
                {
                }
            }, cancellationToken);
        }

        return MapToDto(createdReservation);
    }

    private static ReservationDto MapToDto(Reservation reservation)
    {
        var reservationNumber = "REZ" + reservation.Id.ToString("N").Substring(0, 8).ToUpperInvariant();

        var menuName = string.Empty;
        if (reservation.Menu?.Meals != null && reservation.Menu.Meals.Any())
        {
            menuName = string.Join(" & ", reservation.Menu.Meals.Select(m => m.Name));
        }

        return new ReservationDto
        {
            Id = reservation.Id,
            ReservationNumber = reservationNumber,
            UserId = reservation.UserId,
            UserName = reservation.User?.Name ?? string.Empty,
            RestaurantId = reservation.RestaurantId,
            RestaurantName = reservation.Restaurant?.Name ?? string.Empty,
            MenuId = reservation.MenuId,
            MenuName = menuName,
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
