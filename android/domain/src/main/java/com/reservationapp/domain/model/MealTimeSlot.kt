package com.reservationapp.domain.model

data class MealTimeSlot(
    val id: Int,
    val name: String,
    val turkishName: String?,
    val startTime: String,
    val endTime: String,
    val formattedTimeRange: String?
)
