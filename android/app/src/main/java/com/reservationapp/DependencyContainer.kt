package com.reservationapp

import android.content.Context
import com.google.gson.Gson
import com.reservationapp.core.network.AuthInterceptor
import com.reservationapp.core.network.RetrofitModule
import com.reservationapp.core.network.api.AuthApi
import com.reservationapp.core.storage.SecureStorage
import com.reservationapp.data.repository.AuthRepositoryImpl
import com.reservationapp.domain.repository.AuthRepository
import okhttp3.OkHttpClient
import retrofit2.Retrofit

/**
 * Dependency container for manual dependency injection
 * This is a singleton that provides all dependencies
 */
object DependencyContainer {

    private var context: Context? = null
    private var secureStorage: SecureStorage? = null
    private var gson: Gson? = null
    private var authInterceptor: AuthInterceptor? = null
    private var okHttpClient: OkHttpClient? = null
    private var retrofit: Retrofit? = null
    private var authApi: AuthApi? = null
    private var authRepository: AuthRepository? = null
    private var authStateManager: AuthStateManager? = null

    fun initialize(appContext: Context) {
        context = appContext.applicationContext

        // Initialize in order
        secureStorage = SecureStorage(appContext)
        gson = RetrofitModule.provideGson()
        authInterceptor = AuthInterceptor(
            tokenProvider = { secureStorage?.getAuthToken() }
        )
        okHttpClient = RetrofitModule.provideOkHttpClient(authInterceptor)
        retrofit = RetrofitModule.provideRetrofit(okHttpClient!!, gson!!)
        authApi = retrofit!!.create(AuthApi::class.java)
        authRepository = AuthRepositoryImpl(authApi!!, secureStorage!!)
        authStateManager = AuthStateManager(secureStorage!!, authRepository!!)
    }

    fun getSecureStorage(): SecureStorage {
        return secureStorage ?: throw IllegalStateException("DependencyContainer not initialized")
    }

    fun getAuthRepository(): AuthRepository {
        return authRepository ?: throw IllegalStateException("DependencyContainer not initialized")
    }

    fun getAuthStateManager(): AuthStateManager {
        return authStateManager ?: throw IllegalStateException("DependencyContainer not initialized")
    }

    fun getAuthApi(): AuthApi {
        return authApi ?: throw IllegalStateException("DependencyContainer not initialized")
    }
}

