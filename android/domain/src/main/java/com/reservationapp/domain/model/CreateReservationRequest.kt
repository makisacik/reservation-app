package com.reservationapp.domain.model

data class CreateReservationRequest(
    val restaurantId: String,
    val menuId: String,
    val mealTimeSlotId: Int,
    val date: String, // ISO 8601 format
    val appetizer: Boolean
)
