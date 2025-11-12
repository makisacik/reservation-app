using ReservationApp.Application.DTOs;
using ReservationApp.Application.Interfaces;
using ReservationApp.Domain.Entities;
using ReservationApp.Domain.Exceptions;

namespace ReservationApp.Application.Services;

public class ReservationService : IReservationService
{
    private readonly IReservationRepository _reservationRepository;

    public ReservationService(IReservationRepository reservationRepository)
    {
        _reservationRepository = reservationRepository;
    }

    public async Task<IEnumerable<ReservationDto>> GetAllReservationsAsync(CancellationToken cancellationToken = default)
    {
        var reservations = await _reservationRepository.GetAllAsync(cancellationToken);
        return reservations.Select(MapToDto);
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

    public async Task<ReservationDto> CreateReservationAsync(CreateReservationDto createReservationDto, CancellationToken cancellationToken = default)
    {
        var reservation = new Reservation(
            createReservationDto.CustomerName,
            createReservationDto.Date,
            createReservationDto.Guests
        );

        await _reservationRepository.AddAsync(reservation, cancellationToken);
        await _reservationRepository.SaveChangesAsync(cancellationToken);

        return MapToDto(reservation);
    }

    private static ReservationDto MapToDto(Reservation reservation)
    {
        return new ReservationDto
        {
            Id = reservation.Id,
            CustomerName = reservation.CustomerName,
            Date = reservation.Date,
            Guests = reservation.Guests,
            CreatedAt = reservation.CreatedAt,
            UpdatedAt = reservation.UpdatedAt
        };
    }
}
