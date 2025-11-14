package com.reservationapp.domain.model

data class TodayReservationGroup(
    val mealTimeSlotName: String,
    val startTime: String,
    val endTime: String,
    val restaurantName: String,
    val reservationCount: Int
)

