package com.reservationapp.domain.model

data class UserUpdateRequest(
    val name: String,
    val department: String? = null,
    val role: String, // "User" or "Admin"
    val status: String // "Active" or "Passive"
)

