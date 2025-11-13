using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MimeKit;
using ReservationApp.Application.Interfaces;
using ReservationApp.Domain.Entities;
using ReservationApp.Domain.Enums;

namespace ReservationApp.Application.Services;

public class EmailNotificationService : IEmailNotificationService
{
    private readonly ISettingService _settingService;
    private readonly IConfiguration _configuration;
    private readonly ILogger<EmailNotificationService> _logger;

    public EmailNotificationService(
        ISettingService settingService,
        IConfiguration configuration,
        ILogger<EmailNotificationService> logger)
    {
        _settingService = settingService;
        _configuration = configuration;
        _logger = logger;
    }

    public async Task SendReservationConfirmationAsync(User user, Reservation reservation, CancellationToken cancellationToken = default)
    {
        try
        {
            // Only send emails for Active (confirmed) reservations
            if (reservation.Status != ReservationStatus.Active)
            {
                _logger.LogInformation("Reservation {ReservationId} is not Active (Status: {Status}). Skipping confirmation email for user {UserId}", 
                    reservation.Id, reservation.Status, user.Id);
                return;
            }

            // Check if email is enabled
            var emailEnabled = await _settingService.GetValueAsync<bool>("Notifications", "EmailEnabled", true, cancellationToken);
            if (!emailEnabled)
            {
                _logger.LogInformation("Email notifications are disabled. Skipping reservation confirmation email for user {UserId}", user.Id);
                return;
            }

            var companyName = await _settingService.GetValueAsync<string>("General", "CompanyName", "Toyota ISS", cancellationToken) ?? "Toyota ISS";

            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(
                _configuration["Smtp:FromName"] ?? companyName,
                _configuration["Smtp:FromEmail"] ?? "noreply@toyota-iss.com"));
            message.To.Add(new MailboxAddress(user.Name, user.Email));
            message.Subject = $"Reservation Confirmation - {companyName}";

            var bodyBuilder = new BodyBuilder
            {
                HtmlBody = $@"
                    <html>
                    <body>
                        <h2>Reservation Confirmed</h2>
                        <p>Dear {user.Name},</p>
                        <p>Your meal reservation has been confirmed.</p>
                        <p><strong>Details:</strong></p>
                        <ul>
                            <li>Date: {reservation.Date:yyyy-MM-dd}</li>
                            <li>Time Slot: {reservation.MealTimeSlot?.Name ?? "N/A"}</li>
                            <li>Restaurant: {reservation.Restaurant?.Name ?? "N/A"}</li>
                            <li>Menu: {reservation.Menu?.Date:yyyy-MM-dd}</li>
                            {(reservation.Appetizer ? "<li>Appetizer: Yes</li>" : "")}
                        </ul>
                        <p>Thank you for using {companyName} Meal Reservation System.</p>
                    </body>
                    </html>"
            };

            message.Body = bodyBuilder.ToMessageBody();

            await SendEmailAsync(message, cancellationToken);
            _logger.LogInformation("Reservation confirmation email sent to {Email} for reservation {ReservationId}", user.Email, reservation.Id);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send reservation confirmation email to {Email} for reservation {ReservationId}", user.Email, reservation.Id);
            // Don't throw - email failures shouldn't break the reservation flow
        }
    }

    public async Task SendDailyMenuReminderAsync(User user, IEnumerable<Menu> todayMenus, CancellationToken cancellationToken = default)
    {
        try
        {
            // Check if email is enabled
            var emailEnabled = await _settingService.GetValueAsync<bool>("Notifications", "EmailEnabled", true, cancellationToken);
            if (!emailEnabled)
            {
                _logger.LogInformation("Email notifications are disabled. Skipping daily menu reminder for user {UserId}", user.Id);
                return;
            }

            var dailyReminderEnabled = await _settingService.GetValueAsync<bool>("Notifications", "DailyReminderEnabled", true, cancellationToken);
            if (!dailyReminderEnabled)
            {
                _logger.LogInformation("Daily reminder emails are disabled. Skipping daily menu reminder for user {UserId}", user.Id);
                return;
            }

            var companyName = await _settingService.GetValueAsync<string>("General", "CompanyName", "Toyota ISS", cancellationToken) ?? "Toyota ISS";
            var menusList = todayMenus.ToList();

            if (!menusList.Any())
            {
                _logger.LogInformation("No menus available for today. Skipping daily menu reminder for user {UserId}", user.Id);
                return;
            }

            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(
                _configuration["Smtp:FromName"] ?? companyName,
                _configuration["Smtp:FromEmail"] ?? "noreply@toyota-iss.com"));
            message.To.Add(new MailboxAddress(user.Name, user.Email));
            message.Subject = $"Today's Menu - {companyName}";

            var menuHtml = string.Join("", menusList.Select(menu =>
            {
                var mealsHtml = menu.Meals.Any()
                    ? string.Join("", menu.Meals.Select(meal => $"<li>{meal.Name}{(meal.Description != null ? $" - {meal.Description}" : "")}</li>"))
                    : "<li>No meals available</li>";

                return $@"
                    <div style='margin-bottom: 20px;'>
                        <h3>{menu.Restaurant?.Name ?? "Restaurant"}</h3>
                        <p><strong>Menu Type:</strong> {menu.MenuType}</p>
                        <ul>
                            {mealsHtml}
                        </ul>
                    </div>";
            }));

            var bodyBuilder = new BodyBuilder
            {
                HtmlBody = $@"
                    <html>
                    <body>
                        <h2>Today's Menu</h2>
                        <p>Dear {user.Name},</p>
                        <p>Here are today's available menus:</p>
                        {menuHtml}
                        <p>Make your reservation now!</p>
                        <p>Thank you for using {companyName} Meal Reservation System.</p>
                    </body>
                    </html>"
            };

            message.Body = bodyBuilder.ToMessageBody();

            await SendEmailAsync(message, cancellationToken);
            _logger.LogInformation("Daily menu reminder email sent to {Email}", user.Email);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send daily menu reminder email to {Email}", user.Email);
            // Don't throw - email failures shouldn't break the background job
        }
    }

    private async Task SendEmailAsync(MimeMessage message, CancellationToken cancellationToken)
    {
        var host = _configuration["Smtp:Host"];
        var port = _configuration.GetValue<int>("Smtp:Port", 587);
        var username = _configuration["Smtp:Username"];
        var password = _configuration["Smtp:Password"];

        if (string.IsNullOrWhiteSpace(host))
        {
            _logger.LogWarning("SMTP Host is not configured. Email will not be sent.");
            return;
        }

        // Check if credentials are provided (required for Gmail and most SMTP servers)
        if (string.IsNullOrWhiteSpace(username) || string.IsNullOrWhiteSpace(password))
        {
            _logger.LogWarning(
                "SMTP credentials are not configured. Email will not be sent. " +
                "Please configure Smtp:Username and Smtp:Password in appsettings.json. " +
                "For Gmail, use an App Password: https://support.google.com/accounts/answer/185833");
            return;
        }

        using var client = new SmtpClient();
        try
        {
            await client.ConnectAsync(host, port, SecureSocketOptions.StartTls, cancellationToken);

            // Authenticate with provided credentials
            await client.AuthenticateAsync(username, password, cancellationToken);

            await client.SendAsync(message, cancellationToken);
            await client.DisconnectAsync(true, cancellationToken);
        }
        catch (MailKit.Security.AuthenticationException authEx)
        {
            _logger.LogError(authEx, 
                "SMTP authentication failed. Please verify your credentials. " +
                "For Gmail, ensure you're using an App Password, not your regular password. " +
                "Create an App Password at: https://myaccount.google.com/apppasswords");
            // Don't throw - email failures shouldn't break the application
        }
        catch (MailKit.ServiceNotAuthenticatedException serviceAuthEx)
        {
            _logger.LogError(serviceAuthEx, 
                "SMTP service requires authentication. Please configure Smtp:Username and Smtp:Password. " +
                "For Gmail, use an App Password: https://myaccount.google.com/apppasswords");
            // Don't throw - email failures shouldn't break the application
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending email via SMTP. Host: {Host}, Port: {Port}, Error: {Error}", 
                host, port, ex.Message);
            // Don't throw - email failures shouldn't break the application
        }
    }
}

