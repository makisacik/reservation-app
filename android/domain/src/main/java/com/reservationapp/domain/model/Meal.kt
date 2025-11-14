package com.reservationapp.domain.model

data class Meal(
    val id: String,
    val name: String,
    val categoryId: String,
    val categoryName: String?,
    val restaurantId: String,
    val restaurantName: String?,
    val description: String?,
    val price: Double?,
    val kcal: Int?,
    val imageUrl: String?
)

