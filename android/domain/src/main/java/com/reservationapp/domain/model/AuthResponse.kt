package com.reservationapp.domain.model

import com.google.gson.annotations.SerializedName

data class AuthResponse(
    @SerializedName("token")
    val authToken: String,
    val user: User? = null
)

