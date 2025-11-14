package com.reservationapp.domain.model

data class UpdateUserProfileRequest(
    val name: String,
    val email: String,
    val department: String?
)

