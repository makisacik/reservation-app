package com.reservationapp.domain.model

data class PopularMeal(
    val mealId: String,
    val mealName: String,
    val reservationCount: Int
)

