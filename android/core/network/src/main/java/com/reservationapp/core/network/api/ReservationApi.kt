package com.reservationapp.core.network.api

import com.reservationapp.domain.model.Reservation
import retrofit2.http.GET

interface ReservationApi {
    @GET("reservations/my")
    suspend fun getMyReservations(): List<Reservation>
}

