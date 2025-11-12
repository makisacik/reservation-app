namespace ReservationApp.Application.DTOs;

public class CreateReservationDto
{
    public string CustomerName { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public int Guests { get; set; }
}

