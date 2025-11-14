package com.reservationapp.core.network.api

import com.reservationapp.domain.model.AuthResponse
import com.reservationapp.domain.model.LoginRequest
import com.reservationapp.domain.model.RegisterRequest
import com.reservationapp.domain.model.UpdateUserProfileRequest
import com.reservationapp.domain.model.User
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.PUT
import retrofit2.http.POST

interface AuthApi {
    @POST("auth/login")
    suspend fun login(@Body request: LoginRequest): AuthResponse

    @POST("auth/register")
    suspend fun register(@Body request: RegisterRequest): AuthResponse

    @GET("users/me")
    suspend fun getCurrentUser(): User

    @PUT("users/me")
    suspend fun updateProfile(@Body request: UpdateUserProfileRequest): User
}

