package com.reservationapp.domain.model

data class UserFilterParams(
    val page: Int = 1,
    val pageSize: Int = 10,
    val search: String? = null,
    val status: String? = null, // "Active" or "Passive"
    val role: String? = null, // "User" or "Admin"
    val department: String? = null
)

