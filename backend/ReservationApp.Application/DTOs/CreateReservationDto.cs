using System.Text.Json.Serialization;
using ReservationApp.Application.Converters;

namespace ReservationApp.Application.DTOs;

public class CreateReservationDto
{
    public Guid RestaurantId { get; set; }
    public Guid MenuId { get; set; }
    public int MealTimeSlotId { get; set; }
    
    [JsonConverter(typeof(UtcDateTimeJsonConverter))]
    public DateTime Date { get; set; }
    
    public bool Appetizer { get; set; } = false;
}

