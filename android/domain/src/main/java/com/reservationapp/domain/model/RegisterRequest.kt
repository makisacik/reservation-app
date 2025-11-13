package com.reservationapp.domain.model

data class RegisterRequest(
    val name: String,
    val email: String,
    val password: String
)

