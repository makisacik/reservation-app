package com.reservationapp.core.network

import com.reservationapp.core.common.Result
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import retrofit2.HttpException
import retrofit2.Response
import java.io.IOException

/**
 * Base API service with error handling
 */
suspend fun <T> safeApiCall(
    apiCall: suspend () -> T
): Result<T> {
    return withContext(Dispatchers.IO) {
        try {
            Result.Success(apiCall())
        } catch (throwable: Throwable) {
            when (throwable) {
                is HttpException -> {
                    val errorCode = throwable.code()
                    when (errorCode) {
                        401 -> Result.Error(NetworkError.Unauthorized)
                        404 -> Result.Error(NetworkError.NotFound)
                        in 500..599 -> Result.Error(NetworkError.ServerError)
                        else -> Result.Error(
                            NetworkError.HttpError(
                                errorCode,
                                throwable.message() ?: "Unknown error"
                            )
                        )
                    }
                }
                is IOException -> Result.Error(NetworkError.NetworkException(throwable))
                else -> Result.Error(NetworkError.UnknownError)
            }
        }
    }
}

/**
 * Helper function to handle Response<Unit> from Retrofit DELETE requests
 * Converts Response<Unit> to Unit, throwing HttpException if not successful
 * This wrapper hides the Response type from callers in other modules
 */
suspend fun deleteMealSafely(adminApi: com.reservationapp.core.network.api.AdminApi, id: String): Unit {
    val response = adminApi.deleteMeal(id)
    if (response.isSuccessful) {
        return Unit
    } else {
        throw HttpException(response)
    }
}

