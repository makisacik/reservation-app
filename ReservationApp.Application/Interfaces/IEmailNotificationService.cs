using ReservationApp.Domain.Entities;

namespace ReservationApp.Application.Interfaces;

public interface IEmailNotificationService
{
    Task SendReservationConfirmationAsync(User user, Reservation reservation, CancellationToken cancellationToken = default);
    Task SendDailyMenuReminderAsync(User user, IEnumerable<Menu> todayMenus, CancellationToken cancellationToken = default);
}

