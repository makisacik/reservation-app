package com.reservationapp.domain.model

data class UpdateMealRequest(
    val name: String,
    val categoryId: String,
    val description: String? = null,
    val price: Double? = null,
    val kcal: Int? = null,
    val imageUrl: String? = null
)

