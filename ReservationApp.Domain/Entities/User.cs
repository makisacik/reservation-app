using ReservationApp.Domain.Enums;
using ReservationApp.Domain.Exceptions;

namespace ReservationApp.Domain.Entities;

public class User
{
    public Guid Id { get; private set; }
    public string Email { get; private set; } = string.Empty;
    public string PasswordHash { get; private set; } = string.Empty;
    public UserRole Role { get; private set; } = UserRole.User;
    public DateTime CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; private set; }

    private User() { } // For EF Core

    public User(string email, string passwordHash, UserRole role = UserRole.User)
    {
        if (string.IsNullOrWhiteSpace(email))
        {
            throw new DomainException("Email cannot be empty.");
        }

        if (!IsValidEmail(email))
        {
            throw new DomainException("Invalid email format.");
        }

        if (string.IsNullOrWhiteSpace(passwordHash))
        {
            throw new DomainException("Password hash cannot be empty.");
        }

        Id = Guid.NewGuid();
        Email = email;
        PasswordHash = passwordHash;
        Role = role;
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = null;
    }

    public void UpdatePassword(string newHash)
    {
        if (string.IsNullOrWhiteSpace(newHash))
        {
            throw new DomainException("Password hash cannot be empty.");
        }

        PasswordHash = newHash;
        UpdatedAt = DateTime.UtcNow;
    }

    public void UpdateRole(UserRole newRole)
    {
        Role = newRole;
        UpdatedAt = DateTime.UtcNow;
    }

    private static bool IsValidEmail(string email)
    {
        try
        {
            var addr = new System.Net.Mail.MailAddress(email);
            return addr.Address == email;
        }
        catch
        {
            return false;
        }
    }
}

