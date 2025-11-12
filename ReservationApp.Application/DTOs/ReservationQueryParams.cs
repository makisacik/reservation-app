namespace ReservationApp.Application.DTOs;

public class ReservationQueryParams
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string? Search { get; set; }
    public DateTime? Date { get; set; }
    public DateTime? From { get; set; }
    public DateTime? To { get; set; }
    public string? SortBy { get; set; } = "date";
    public string? SortOrder { get; set; } = "asc";
}

