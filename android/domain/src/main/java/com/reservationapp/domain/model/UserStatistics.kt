package com.reservationapp.domain.model

data class UserStatistics(
    val totalUsers: Int,
    val activeUsers: Int,
    val passiveUsers: Int,
    val newThisMonth: Int
)

