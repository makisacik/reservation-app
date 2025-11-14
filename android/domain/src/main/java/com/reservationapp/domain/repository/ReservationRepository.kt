package com.reservationapp.domain.repository

import com.reservationapp.core.common.Result
import com.reservationapp.domain.model.Reservation

interface ReservationRepository {
    suspend fun getMyReservations(): Result<List<Reservation>>
}

