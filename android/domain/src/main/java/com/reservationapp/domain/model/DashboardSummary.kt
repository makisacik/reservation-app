package com.reservationapp.domain.model

data class DashboardSummary(
    val totalReservations: Int,
    val totalReservationsChangePercent: Double,
    val activeUsers: Int,
    val activeUsersChangePercent: Double,
    val todayMeals: Int,
    val todayMealsChangePercent: Double,
    val monthlyCost: Double,
    val monthlyCostChangePercent: Double,
    // Legacy fields
    val totalUsers: Int,
    val totalMeals: Int,
    val totalRestaurants: Int
)

