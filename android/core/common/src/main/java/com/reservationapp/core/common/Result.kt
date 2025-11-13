package com.reservationapp.core.common

/**
 * A generic class that holds a value or an exception
 */
sealed class Result<out T> {
    data class Success<T>(val data: T) : Result<T>()
    data class Error(val exception: Throwable) : Result<Nothing>()
    object Loading : Result<Nothing>()
}

/**
 * Extension function to get data from Result
 */
inline fun <T> Result<T>.getOrNull(): T? {
    return when (this) {
        is Result.Success -> data
        else -> null
    }
}

/**
 * Extension function to get error from Result
 */
fun <T> Result<T>.getErrorOrNull(): Throwable? {
    return when (this) {
        is Result.Error -> exception
        else -> null
    }
}

