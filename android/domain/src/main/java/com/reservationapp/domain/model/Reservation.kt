package com.reservationapp.domain.model

data class Reservation(
    val id: String,
    val reservationNumber: String,
    val userId: String,
    val userName: String,
    val restaurantId: String,
    val restaurantName: String,
    val menuId: String,
    val menuName: String,
    val mealTimeSlotId: Int,
    val mealTimeSlotName: String,
    val date: String,
    val appetizer: Boolean,
    val status: String,
    val createdAt: String,
    val updatedAt: String?
)

