package com.reservationapp.domain.repository

import com.reservationapp.core.common.Result
import com.reservationapp.domain.model.User

interface AuthRepository {
    suspend fun login(email: String, password: String): Result<String> // Returns token
    suspend fun register(name: String, email: String, password: String): Result<String>
    suspend fun getCurrentUser(): Result<User>
    suspend fun logout()
}

