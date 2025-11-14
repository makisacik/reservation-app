package com.reservationapp.core.network.api

import com.reservationapp.domain.model.CreateReservationRequest
import com.reservationapp.domain.model.Reservation
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST

interface ReservationApi {
    @GET("reservations/my")
    suspend fun getMyReservations(): List<Reservation>
    
    @POST("reservations")
    suspend fun createReservation(@Body request: CreateReservationRequest): Reservation
}

