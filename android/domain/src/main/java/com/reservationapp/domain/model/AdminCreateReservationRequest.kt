package com.reservationapp.domain.model

data class AdminCreateReservationRequest(
    val userId: String,
    val restaurantId: String,
    val menuId: String,
    val mealTimeSlotId: Int,
    val date: String,
    val appetizer: Boolean
)

