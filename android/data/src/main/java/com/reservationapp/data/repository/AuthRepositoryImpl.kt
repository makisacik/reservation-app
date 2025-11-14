package com.reservationapp.data.repository

import com.reservationapp.core.common.Result
import com.reservationapp.core.network.api.AuthApi
import com.reservationapp.core.network.safeApiCall
import com.reservationapp.core.storage.SecureStorage
import com.reservationapp.domain.model.AuthResponse
import com.reservationapp.domain.model.LoginRequest
import com.reservationapp.domain.model.RegisterRequest
import com.reservationapp.domain.model.UpdateUserProfileRequest
import com.reservationapp.domain.model.User
import com.reservationapp.domain.repository.AuthRepository

class AuthRepositoryImpl(
    private val authApi: AuthApi,
    private val secureStorage: SecureStorage
) : AuthRepository {

    override suspend fun login(email: String, password: String): Result<AuthResponse> {
        return safeApiCall {
            val request = LoginRequest(email = email, password = password)
            val response = authApi.login(request)

            // Save token to secure storage
            if (response.authToken.isNotEmpty()) {
                secureStorage.saveAuthToken(response.authToken)
                response.user?.id?.let { secureStorage.saveUserId(it) }
            }

            response
        }
    }

    override suspend fun register(request: RegisterRequest): Result<AuthResponse> {
        return safeApiCall {
            val response = authApi.register(request)

            // Save token to secure storage
            if (response.authToken.isNotEmpty()) {
                secureStorage.saveAuthToken(response.authToken)
                response.user?.id?.let { secureStorage.saveUserId(it) }
            }

            response
        }
    }

    override suspend fun getCurrentUser(): Result<User> {
        return safeApiCall {
            authApi.getCurrentUser()
        }
    }

    override suspend fun updateProfile(request: UpdateUserProfileRequest): Result<User> {
        return safeApiCall {
            authApi.updateProfile(request)
        }
    }

    override suspend fun logout() {
        secureStorage.clearAll()
    }
}

