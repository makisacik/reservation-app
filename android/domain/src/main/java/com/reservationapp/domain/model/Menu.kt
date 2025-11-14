package com.reservationapp.domain.model

data class Menu(
    val id: String,
    val restaurantId: String,
    val restaurantName: String?,
    val date: String,
    val menuType: String,
    val meals: List<Meal>
)

