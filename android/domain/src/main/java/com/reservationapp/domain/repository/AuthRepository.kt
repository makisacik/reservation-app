package com.reservationapp.domain.repository

import com.reservationapp.core.common.Result
import com.reservationapp.domain.model.AuthResponse
import com.reservationapp.domain.model.RegisterRequest
import com.reservationapp.domain.model.UpdateUserProfileRequest
import com.reservationapp.domain.model.User

interface AuthRepository {
    suspend fun login(email: String, password: String): Result<AuthResponse>
    suspend fun register(request: RegisterRequest): Result<AuthResponse>
    suspend fun getCurrentUser(): Result<User>
    suspend fun updateProfile(request: UpdateUserProfileRequest): Result<User>
    suspend fun logout()
}

