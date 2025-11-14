package com.reservationapp.domain.model

data class AdminReservationQueryParams(
    val page: Int = 1,
    val pageSize: Int = 10,
    val dateFrom: String? = null,
    val dateTo: String? = null,
    val search: String? = null,
    val status: String? = null
)

