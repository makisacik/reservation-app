namespace ReservationApp.Application.DTOs;

public class SettingsUpdateDto
{
    public IDictionary<string, string> Settings { get; set; } = new Dictionary<string, string>();
}

