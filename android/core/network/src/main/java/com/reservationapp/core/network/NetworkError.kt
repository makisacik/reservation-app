package com.reservationapp.core.network

sealed class NetworkError(override val message: String = "") : Exception(message) {
    data class HttpError(val code: Int, override val message: String) : NetworkError(message)
    data class NetworkException(val throwable: Throwable) : NetworkError(throwable.message ?: "Network error")
    object UnknownError : NetworkError("Unknown error")
    object Unauthorized : NetworkError("Unauthorized")
    object NotFound : NetworkError("Not found")
    object ServerError : NetworkError("Server error")
}

