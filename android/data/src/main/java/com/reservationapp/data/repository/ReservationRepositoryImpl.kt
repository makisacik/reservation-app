package com.reservationapp.data.repository

import com.reservationapp.core.common.Result
import com.reservationapp.core.network.api.ReservationApi
import com.reservationapp.core.network.safeApiCall
import com.reservationapp.domain.model.Reservation
import com.reservationapp.domain.repository.ReservationRepository

class ReservationRepositoryImpl(
    private val reservationApi: ReservationApi
) : ReservationRepository {

    override suspend fun getMyReservations(): Result<List<Reservation>> {
        return safeApiCall {
            reservationApi.getMyReservations()
        }
    }
}

