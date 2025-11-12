using ReservationApp.Domain.Exceptions;

namespace ReservationApp.Domain.Entities;

public class Reservation
{
    public Guid Id { get; private set; }
    public string CustomerName { get; private set; } = string.Empty;
    public DateTime Date { get; private set; }
    public int Guests { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; private set; }

    private Reservation() { } // For EF Core

    public Reservation(string customerName, DateTime date, int guests)
    {
        Id = Guid.NewGuid();
        CustomerName = customerName ?? throw new ArgumentNullException(nameof(customerName));
        Date = date;
        Guests = guests;
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = null;

        Validate();
    }

    public void Update(string customerName, DateTime date, int guests)
    {
        CustomerName = customerName ?? throw new ArgumentNullException(nameof(customerName));
        Date = date;
        Guests = guests;
        UpdatedAt = DateTime.UtcNow;

        Validate();
    }

    private void Validate()
    {
        if (string.IsNullOrWhiteSpace(CustomerName))
        {
            throw new DomainException("Customer name cannot be empty.");
        }

        if (Date < DateTime.UtcNow.Date)
        {
            throw new DomainException("Reservation date cannot be in the past.");
        }

        if (Guests <= 0)
        {
            throw new DomainException("Number of guests must be greater than zero.");
        }

        if (Guests > 50)
        {
            throw new DomainException("Number of guests cannot exceed 50.");
        }
    }
}

