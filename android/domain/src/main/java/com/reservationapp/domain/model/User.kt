package com.reservationapp.domain.model

data class User(
    val id: String,
    val name: String,
    val email: String,
    val department: String?,
    val role: String,
    val status: String?,
    val totalReservations: Int?,
    val createdAt: String?
)

