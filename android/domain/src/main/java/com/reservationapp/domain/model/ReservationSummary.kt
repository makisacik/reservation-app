package com.reservationapp.domain.model

data class ReservationSummary(
    val todayCount: Int,
    val thisWeekCount: Int,
    val thisMonthCount: Int,
    val pendingCount: Int
)

