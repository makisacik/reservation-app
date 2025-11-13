using ReservationApp.Domain.Enums;

namespace ReservationApp.Application.DTOs;

public class AdminReservationQueryParams
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public DateTime DateFrom { get; set; }
    public DateTime DateTo { get; set; }
    public Guid? RestaurantId { get; set; }
    public string? Department { get; set; }
    public ReservationStatus? Status { get; set; }
    public string? Search { get; set; }
}

