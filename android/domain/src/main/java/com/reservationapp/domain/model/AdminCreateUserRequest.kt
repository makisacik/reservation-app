package com.reservationapp.domain.model

data class AdminCreateUserRequest(
    val name: String,
    val email: String,
    val password: String,
    val department: String? = null,
    val role: String // "User" or "Admin"
)

